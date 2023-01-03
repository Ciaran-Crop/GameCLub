#! /usr/bin/env python3 
import glob
import sys
import random
sys.path.insert(0, glob.glob('../../../')[0])

from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer

from splendor_match_service.splendor_match.ttypes import SplendorPlayer
from splendor_match_service.splendor_match import SplendorMatch
from splendor_match_service.splendor_save import SplendorSave
from gameclub.views.common import get_state, random_cards, random_nobles
from asgiref.sync import async_to_sync
from acapp.asgi import channel_layer
from django.core.cache import cache

class SplendorSaveHandler:
    def save_data(self, mplayers):
        print('match success:', [player.email for player in mplayers])
        room_id = 'splendor-room_' + get_state()
        passwd = get_state()

        cards_list = random_cards()
        base_nobles = random_nobles()
        config = {
            'room_player_number': len(mplayers),
            'room_round_second': 60,
            'room_pass': passwd,
            'base_level1_list':cards_list[0],
            'base_level2_list':cards_list[1],
            'base_level3_list': cards_list[2],
            'base_nobles': base_nobles,
            'state': 'start',
        }

        for pr in mplayers:
            async_to_sync(channel_layer.group_add)(room_id, pr.channel_name)

        room_set = {'config': config, 'players': []}
        cache.set(room_id, room_set , 4800)

        async_to_sync(channel_layer.group_send)(
            room_id,
            {
                'type': 'group_send_event',
                'event': 'match_success',
                'content': {'room_id': room_id, 'pass': passwd},
            }
        )

        return 0

if __name__ == '__main__':
    handler = SplendorSaveHandler()
    processor = SplendorSave.Processor(handler)
    transport = TSocket.TServerSocket(host='127.0.0.1', port=9092)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    server = TServer.TSimpleServer(processor, transport, tfactory, pfactory)

    print('Starting the server...')
    server.serve()
    print('done.')

