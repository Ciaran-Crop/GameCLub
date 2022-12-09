#! /usr/bin/env python3
import glob
import sys
sys.path.insert(0, glob.glob('../../../')[0])

from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer

from splendor_match_service.splendor_match import SplendorMatch
from splendor_match_service.splendor_save import SplendorSave
from threading import Thread
from time import sleep

class Pool:
    def __init__(self):
        self.players = []

    def match(self):
        while len(self.players) >= 4:
            self.players = sorted(self.players, key = lambda pr: pr.score)
            flag = False
            for i in range(len(self.players) - 3):
                pr1, pr2, pr3, pr4 = self.players[i], self.players[i+1], self.players[i+2], self.players[i+3]
                if self.check_match(pr1,pr2) and self.check_match(pr1,pr3) and self.check_match(pr1, pr4) and self.check_match(pr2, pr3) and self.check_match(pr2, pr4) and self.check_match(pr3, pr4):
                    self.match_success([pr1,pr2,pr3,pr4])
                    self.players = self.players[:i] + self.players[i+4:]
                    print('match_success, players len:', len(self.players))
                    flag = True
                    break
            if not flag:
                break
        self.increase_waiting()

    def check_match(self, pr1, pr2):
        dis = abs(pr1.score - pr2.score)
        pr1_max_dis = pr1.waiting_time * 50
        pr2_max_dis = pr2.waiting_time * 50
        return dis <= pr1_max_dis and dis <= pr2_max_dis

    def match_success(self, mplayers):
        transport = TSocket.TSocket('127.0.0.1', 9092)
        transport = TTransport.TBufferedTransport(transport)
        protocol = TBinaryProtocol.TBinaryProtocol(transport)
        client = SplendorSave.Client(protocol)
        transport.open()
        client.save_data(mplayers)
        transport.close()

    def increase_waiting(self):
        for player in self.players:
            player.waiting_time += 1

    def add_player(self, pr):
        self.players.append(pr)
        print(len(self.players))

    def remove_player(self, pr):
        for index in range(len(self.players)):
            try:
                pri = self.players[index]
                if pri.email == pr.email:
                    self.players = self.players[:index] + self.players[index+1:]
                    break
            except:
                print('remove fail, players len:', len(self.players))
                return 0
        print(len(self.players))

def get_player_from_queue():
    try:
        return queue.get_nowait()
    except:
        return None

pool = Pool()

class SplendorMatchHandler:
    def add_player(self, player, info):
        for index in range(len(pool.players)):
            try:
                pri = pool.players[index]
                if pri.email == player.email:
                    print("{}: player {} existed!".format(info, player.email))
                    return 0
            except:
                print('someting')
        print("{}: {} {}".format(info, player.email, player.score))
        pool.add_player(player)
        return 0

    def remove_player(self, player, info):
        print("{}: {} {}".format(info, player.email, player.score))
        pool.remove_player(player)
        return 0


def worker():
    while True:
        pool.match()
        sleep(2)

if __name__ == '__main__':
    handler = SplendorMatchHandler()
    processor = SplendorMatch.Processor(handler)
    transport = TSocket.TServerSocket(host='127.0.0.1', port=9091)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    server = TServer.TSimpleServer(processor, transport, tfactory, pfactory)

    Thread(target=worker, daemon=True).start()

    print('Starting the server...')
    server.serve()
    print('done.')
