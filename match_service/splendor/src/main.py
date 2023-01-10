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

    def match_func(self, l):
        while len(self.players) >= l:
            self.players = sorted(self.players, key = lambda pr: pr.score)
            flag = False
            for i in range(len(self.players) - l + 1):
                prs = []
                for index in range(l):
                    prs.append(self.players[i + index])
                check = True
                for j in range(l):
                    for k in range(j + 1, l):
                        check = check & self.check_match(prs[j], prs[k])
                if check:
                    self.match_success(prs)
                    self.players = self.players[:i] + self.players[i+l:]
                    print('match_success, players len:', len(self.players))
                    flag = True
                    break
            if not flag:
                break
        self.increase_waiting()

    def match(self):
        max_waiting = self.get_waiting()
        if max_waiting < 40:
            self.match_func(4)
        elif max_waiting >= 40:
            self.match_func(max(2, min(len(self.players), 4)))

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

    def get_waiting(self):
        maxn = 0
        for player in self.players:
            maxn = max(maxn, player.waiting_time)
        return maxn

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
