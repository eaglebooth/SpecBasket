"""Controlled mutations of an observed public RPC shape; not live recovery proof."""
import base64
import copy
import json
import types
import pytest
import test_contract as h
from test_contract import reset

TX = '0x' + 'ab' * 32


def proof():
    return {'hash':TX,'tx_id':TX,'from_address':h.A,'sender':h.A,'to_address':h.ADDRESS,'recipient':h.ADDRESS,
            'type':2,'status':'FINALIZED','result':6,'value':1,'value_credited':True,'triggered_by':None,
            'messages':[],'triggered_transactions':[],
            'consensus_data':{'leader_receipt':[{'mode':'validator'}, {'mode':'leader','execution_result':'ERROR',
                'pending_transactions':[],'result':base64.b64encode(b'\x01EXACT_VALUE_REQUIRED').decode()}]}}


def rpc(monkeypatch, transaction, chain='0xf22f'):
    def post(url, headers, body):
        assert url == h.sb.RECOVERY_RPC and headers['Content-Type'] == 'application/json'
        request=json.loads(body)
        result=chain if request['method']=='eth_chainId' else transaction
        return types.SimpleNamespace(status=200,body=json.dumps({'jsonrpc':'2.0','id':1,'result':result}).encode())
    monkeypatch.setattr(h.gl.nondet.web,'post',post,raising=False)


def test_recover_credited_known_rollback_to_its_sender_once(monkeypatch):
    c=h.fresh();c.balance=1;rpc(monkeypatch,proof())
    result=json.loads(h.call(c,'recover_failed_deposit',TX))
    assert result['status']=='REFUND_EMITTED' and result['recipient']==h.A and result['amount_wei']=='1'
    assert c.balance==0 and h.transfers==[(h.A,1)] and TX in c.recovered_deposits
    assert json.loads(c.get_refund_receipt(result['id']))==result
    with pytest.raises(h.UserError,match='DEPOSIT_ALREADY_CLAIMED'):
        h.call(c,'recover_failed_deposit','0x'+TX[2:].upper())


@pytest.mark.parametrize('field,value',[
    ('hash','0x'+'2'*64),('from_address',h.B),('to_address',h.B),('sender',h.B),('recipient',h.B),('tx_id','0x'+'2'*64),
    ('status','ACCEPTED'),('result',0),('value_credited',False),('value_credited',1),('triggered_by','parent'),
    ('messages',[{}]),('triggered_transactions',['child']),('type',1),('type',True),
    ('value',0),('value',-1),('value',True),('value',1.5),('value','01'),('value','0x1'),('value',str(2**256)),
])
def test_forged_or_wrong_deposit_fails_without_refund(monkeypatch,field,value):
    c=h.fresh();c.balance=10;transaction=proof();transaction[field]=value;rpc(monkeypatch,transaction)
    before=copy.deepcopy(c.__dict__)
    with pytest.raises((ValueError,RuntimeError)):
        h.call(c,'recover_failed_deposit',TX)
    assert c.__dict__==before and not h.transfers


@pytest.mark.parametrize('field',['hash','status','result','value','value_credited','triggered_by','messages','triggered_transactions','consensus_data','type'])
def test_missing_rpc_fields_cannot_be_assumed_safe(monkeypatch,field):
    c=h.fresh();c.balance=1;transaction=proof();del transaction[field];rpc(monkeypatch,transaction)
    with pytest.raises(ValueError):h.call(c,'recover_failed_deposit',TX)
    assert not c.recovered_deposits and not h.transfers


@pytest.mark.parametrize('change',['success','pending','missing_pending','ambiguous','crash','bad_base64'])
def test_requires_exactly_one_known_rollback_leader(monkeypatch,change):
    c=h.fresh();c.balance=1;transaction=proof();leader=transaction['consensus_data']['leader_receipt'][1]
    if change=='success':leader['execution_result']='SUCCESS'
    if change=='pending':leader['pending_transactions']=[{}]
    if change=='missing_pending':del leader['pending_transactions']
    if change=='ambiguous':transaction['consensus_data']['leader_receipt'].append(copy.deepcopy(leader))
    if change=='crash':leader['result']=base64.b64encode(b'\x02panic').decode()
    if change=='bad_base64':leader['result']='invalid base64'
    rpc(monkeypatch,transaction)
    with pytest.raises((ValueError,RuntimeError)):h.call(c,'recover_failed_deposit',TX)
    assert not h.transfers and not c.recovered_deposits


def test_wrong_network_or_insufficient_native_balance_rejects(monkeypatch):
    c=h.fresh();rpc(monkeypatch,proof(),chain='0x1')
    with pytest.raises(ValueError,match='RECOVERY_NETWORK'):h.call(c,'recover_failed_deposit',TX)
    rpc(monkeypatch,proof())
    with pytest.raises(h.UserError,match='RECOVERY_BALANCE'):h.call(c,'recover_failed_deposit',TX)
    assert not c.recovered_deposits and not h.transfers


def test_duplicate_recovery_rechecked_after_consensus(monkeypatch):
    c=h.fresh();c.balance=1;rpc(monkeypatch,proof())
    h.after_consensus=lambda:c.recovered_deposits.__setitem__(TX,'concurrent-claim')
    with pytest.raises(h.UserError,match='DEPOSIT_ALREADY_CLAIMED'):h.call(c,'recover_failed_deposit',TX)
    assert not h.transfers


def test_refund_emission_failure_does_not_consume_recovery_proof(monkeypatch):
    c=h.fresh();c.balance=1;rpc(monkeypatch,proof());h.fail_transfer=True
    with pytest.raises(RuntimeError,match='EMISSION_FAILED'):h.call(c,'recover_failed_deposit',TX)
    assert c.balance==1 and not c.recovered_deposits and not h.transfers


def test_recovery_source_failure_no_state_change(monkeypatch):
    c=h.fresh();c.balance=1
    monkeypatch.setattr(h.gl.nondet.web,'post',lambda *a,**k:types.SimpleNamespace(status=503,body=b''),raising=False)
    with pytest.raises(ValueError,match='RECOVERY_SOURCE_UNAVAILABLE'):h.call(c,'recover_failed_deposit',TX)
    assert c.balance==1 and not h.transfers


def test_positive_replay_refunds_only_new_attached_value():
    c=h.fresh();key=h.payable(c);digest=h.read(c,key)['assessment_digest']
    h.call(c,'fund_and_publish',key,digest,value=100)
    result=json.loads(h.call(c,'fund_and_publish',key,digest,value=3))
    assert result['status']=='REJECTED_REFUND_EMITTED' and result['reason']=='NOT_PAYABLE'
    assert h.transfers==[(h.B,100),(h.A,3)] and c.balance==0
    assert h.read(c,key)['emitted_wei']=='100'
