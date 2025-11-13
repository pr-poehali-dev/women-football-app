import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface Game {
  id: number;
  opponent: string;
  date: string;
  time: string;
  location: string;
  type: 'home' | 'away';
  registered: string[];
  maxPlayers: number;
}

interface TeamStats {
  name: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
}

interface Message {
  id: number;
  author: string;
  text: string;
  time: string;
}

const mockGames: Game[] = [
  { id: 1, opponent: 'Спартак Ж', date: '2025-11-20', time: '18:00', location: 'Стадион Луч', type: 'home', registered: ['Анна', 'Мария', 'Елена', 'Софья', 'Ольга', 'Дарья', 'Виктория'], maxPlayers: 11 },
  { id: 2, opponent: 'Динамо Ж', date: '2025-11-27', time: '19:00', location: 'Центральный стадион', type: 'away', registered: ['Анна', 'Мария', 'Елена', 'Софья'], maxPlayers: 11 },
  { id: 3, opponent: 'Зенит Ж', date: '2025-12-04', time: '17:30', location: 'Стадион Луч', type: 'home', registered: ['Анна', 'Мария'], maxPlayers: 11 }
];

const mockTable: TeamStats[] = [
  { name: 'Наша команда', played: 15, won: 11, draw: 2, lost: 2, points: 35 },
  { name: 'Спартак Ж', played: 15, won: 10, draw: 3, lost: 2, points: 33 },
  { name: 'Динамо Ж', played: 15, won: 9, draw: 2, lost: 4, points: 29 },
  { name: 'Зенит Ж', played: 15, won: 7, draw: 4, lost: 4, points: 25 },
  { name: 'Локомотив Ж', played: 15, won: 6, draw: 3, lost: 6, points: 21 },
  { name: 'ЦСКА Ж', played: 15, won: 3, draw: 2, lost: 10, points: 11 }
];

const mockMessages: Message[] = [
  { id: 1, author: 'Анна', text: 'Всем привет! Готовимся к завтрашней игре? 💪', time: '14:30' },
  { id: 2, author: 'Мария', text: 'Да! Буду на разминке в 17:00', time: '14:35' },
  { id: 3, author: 'Елена', text: 'Кто-нибудь может подвезти? 🚗', time: '14:40' },
  { id: 4, author: 'Софья', text: 'Я могу забрать тебя, напиши адрес', time: '14:42' }
];

const Index = () => {
  const [games, setGames] = useState<Game[]>(mockGames);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const userName = 'Вы';
  const { toast } = useToast();

  useEffect(() => {
    const checkUpcomingGames = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      games.forEach(game => {
        const gameDate = new Date(game.date);
        const timeDiff = gameDate.getTime() - now.getTime();
        const hoursUntilGame = timeDiff / (1000 * 60 * 60);
        
        if (game.registered.includes(userName) && hoursUntilGame > 0 && hoursUntilGame <= 24) {
          toast({
            title: '⚽ Напоминание о матче',
            description: `Завтра игра против ${game.opponent} в ${game.time}. ${game.location}`,
            duration: 6000,
          });
        }
      });
    };

    checkUpcomingGames();
    const interval = setInterval(checkUpcomingGames, 3600000);
    
    return () => clearInterval(interval);
  }, [games, userName, toast]);

  const registerForGame = (gameId: number) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      toast({
        title: '✅ Вы записаны на игру',
        description: `${game.opponent} — ${new Date(game.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} в ${game.time}`,
        duration: 4000,
      });
    }
    setGames(games.map(game => 
      game.id === gameId && !game.registered.includes(userName)
        ? { ...game, registered: [...game.registered, userName] }
        : game
    ));
  };

  const unregisterFromGame = (gameId: number) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      toast({
        title: 'Запись отменена',
        description: `Вы больше не записаны на игру ${game.opponent}`,
        variant: 'destructive',
        duration: 3000,
      });
    }
    setGames(games.map(game => 
      game.id === gameId
        ? { ...game, registered: game.registered.filter(name => name !== userName) }
        : game
    ));
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        author: userName,
        text: newMessage,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      }]);
      setNewMessage('');
    }
  };

  const playerStats = {
    goals: 18,
    assists: 12,
    matches: 15,
    winRate: Math.round((11 / 15) * 100)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint/10 via-blue/10 to-cyan/10">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Icon name="Trophy" size={40} className="text-yellow" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-mint via-blue to-cyan bg-clip-text text-transparent">
              Женская Футбольная Команда
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Вместе к победе! ⚽</p>
        </header>

        <Tabs defaultValue="schedule" className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-4 mb-6 h-auto">
            <TabsTrigger value="schedule" className="flex items-center gap-2 py-3">
              <Icon name="Calendar" size={18} />
              <span className="hidden sm:inline">Расписание</span>
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2 py-3">
              <Icon name="Table" size={18} />
              <span className="hidden sm:inline">Таблица</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2 py-3">
              <Icon name="BarChart3" size={18} />
              <span className="hidden sm:inline">Статистика</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2 py-3">
              <Icon name="MessageCircle" size={18} />
              <span className="hidden sm:inline">Чат</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            {games.map((game, index) => {
              const isRegistered = game.registered.includes(userName);
              const spotsLeft = game.maxPlayers - game.registered.length;
              
              return (
                <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader className={`${game.type === 'home' ? 'bg-mint/10' : 'bg-blue/10'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl flex items-center gap-2 mb-2">
                          {game.opponent}
                          <Badge variant={game.type === 'home' ? 'default' : 'secondary'} className="ml-2">
                            {game.type === 'home' ? 'Дома' : 'В гостях'}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-base space-y-1">
                          <div className="flex items-center gap-2">
                            <Icon name="Calendar" size={16} />
                            <span>{new Date(game.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                            <Icon name="Clock" size={16} className="ml-2" />
                            <span>{game.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="MapPin" size={16} />
                            <span>{game.location}</span>
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Записано: {game.registered.length}/{game.maxPlayers}</span>
                          <Badge variant={spotsLeft <= 2 ? 'destructive' : 'outline'}>
                            {spotsLeft > 0 ? `Осталось мест: ${spotsLeft}` : 'Набор закрыт'}
                          </Badge>
                        </div>
                        <Progress value={(game.registered.length / game.maxPlayers) * 100} className="h-2" />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {game.registered.map((player, i) => (
                          <Badge key={i} variant="secondary" className="text-sm">
                            {player}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        {isRegistered ? (
                          <Button 
                            onClick={() => unregisterFromGame(game.id)}
                            variant="outline"
                            className="flex-1"
                          >
                            <Icon name="UserMinus" size={18} className="mr-2" />
                            Отменить запись
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => registerForGame(game.id)}
                            disabled={spotsLeft === 0}
                            className="flex-1 bg-gradient-to-r from-mint to-cyan hover:opacity-90"
                          >
                            <Icon name="UserPlus" size={18} className="mr-2" />
                            Записаться
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="table">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Trophy" size={24} className="text-yellow" />
                  Турнирная таблица
                </CardTitle>
                <CardDescription>Сезон 2025/2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">#</th>
                        <th className="text-left p-3 font-semibold">Команда</th>
                        <th className="text-center p-3 font-semibold">И</th>
                        <th className="text-center p-3 font-semibold">В</th>
                        <th className="text-center p-3 font-semibold">Н</th>
                        <th className="text-center p-3 font-semibold">П</th>
                        <th className="text-center p-3 font-semibold">О</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTable.map((team, index) => (
                        <tr 
                          key={team.name} 
                          className={`border-b hover:bg-muted/50 transition-colors ${index === 0 ? 'bg-mint/10 font-semibold' : ''}`}
                        >
                          <td className="p-3">
                            {index === 0 && <Icon name="Star" size={16} className="inline text-yellow mr-1" />}
                            {index + 1}
                          </td>
                          <td className="p-3">{team.name}</td>
                          <td className="text-center p-3">{team.played}</td>
                          <td className="text-center p-3">{team.won}</td>
                          <td className="text-center p-3">{team.draw}</td>
                          <td className="text-center p-3">{team.lost}</td>
                          <td className="text-center p-3 font-bold">{team.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-mint/20 to-mint/5 border-mint/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Голы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Icon name="Target" size={32} className="text-mint" />
                    <span className="text-4xl font-bold">{playerStats.goals}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue/20 to-blue/5 border-blue/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Передачи</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Icon name="Zap" size={32} className="text-blue" />
                    <span className="text-4xl font-bold">{playerStats.assists}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan/20 to-cyan/5 border-cyan/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Матчи</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Icon name="Users" size={32} className="text-cyan" />
                    <span className="text-4xl font-bold">{playerStats.matches}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow/20 to-yellow/5 border-yellow/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Победы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Icon name="TrendingUp" size={32} className="text-yellow" />
                    <span className="text-4xl font-bold">{playerStats.winRate}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Динамика команды</CardTitle>
                <CardDescription>Последние 10 матчей</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between gap-2 h-48">
                  {[3, 1, 3, 0, 3, 1, 3, 3, 0, 3].map((points, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className={`w-full rounded-t transition-all hover:opacity-80 ${
                          points === 3 ? 'bg-mint' : points === 1 ? 'bg-yellow' : 'bg-destructive'
                        }`}
                        style={{ height: `${(points / 3) * 100}%` }}
                      />
                      <span className="text-xs text-muted-foreground">М{i + 1}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-mint" />
                    <span className="text-sm">Победа (3 очка)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow" />
                    <span className="text-sm">Ничья (1 очко)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-destructive" />
                    <span className="text-sm">Поражение (0 очков)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="MessageCircle" size={24} />
                  Командный чат
                </CardTitle>
                <CardDescription>Общайтесь с командой</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 px-6">
                  <div className="space-y-4 py-4">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex items-start gap-3 ${msg.author === userName ? 'flex-row-reverse' : ''}`}
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-mint to-cyan text-white">
                            {msg.author[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`flex-1 ${msg.author === userName ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold">{msg.author}</span>
                            <span className="text-xs text-muted-foreground">{msg.time}</span>
                          </div>
                          <div 
                            className={`inline-block rounded-lg px-4 py-2 ${
                              msg.author === userName 
                                ? 'bg-gradient-to-r from-mint to-cyan text-white' 
                                : 'bg-muted'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Написать сообщение..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={sendMessage}
                      className="bg-gradient-to-r from-mint to-cyan hover:opacity-90"
                    >
                      <Icon name="Send" size={18} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;