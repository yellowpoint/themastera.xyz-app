"use client";
import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Badge,
  Chip,
  Progress,
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import { addToast } from "@heroui/toast";

// 用户等级配置
const membershipLevels = {
  free: { name: "Free", color: "default", benefits: ["基础内容访问", "社区参与"] },
  creator: { name: "Creator+", color: "primary", benefits: ["高清下载", "创作者工具", "优先客服"] },
  artcircle: { name: "ArtCircle", color: "secondary", benefits: ["流媒体下载", "明星活动抢票", "专属圈子"] },
  vip: { name: "VIP", color: "warning", benefits: ["全部权限", "VIP专属活动", "一对一服务"] }
};

// 内容类型
const contentTypes = [
  { id: 1, type: "visual", title: "视觉艺术作品", author: "Artist_01", downloads: 1234, premium: false },
  { id: 2, type: "audio", title: "独家音乐专辑", author: "Musician_02", downloads: 856, premium: true },
  { id: 3, type: "animation", title: "3D动画短片", author: "Animator_03", downloads: 642, premium: true },
  { id: 4, type: "photography", title: "摄影作品集", author: "Photographer_04", downloads: 923, premium: false },
];

export default function MasteraPlatform() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userProfile, setUserProfile] = useState({
    name: "创作者用户",
    level: "creator",
    points: 2580,
    avatar: "/api/placeholder/64/64",
    badges: ["新人", "活跃用户", "创作达人"],
    activityLog: [
      { action: "登录", points: 10, time: "2024-01-15 09:00" },
      { action: "发布作品", points: 50, time: "2024-01-14 15:30" },
      { action: "评论互动", points: 5, time: "2024-01-14 14:20" },
    ]
  });

  const { isOpen: isProfileOpen, onOpen: onProfileOpen, onOpenChange: onProfileOpenChange } = useDisclosure();
  const { isOpen: isContentOpen, onOpen: onContentOpen, onOpenChange: onContentOpenChange } = useDisclosure();

  const handlePointsAction = (action, points) => {
    setUserProfile(prev => ({
      ...prev,
      points: prev.points + points,
      activityLog: [
        { action, points, time: new Date().toLocaleString() },
        ...prev.activityLog.slice(0, 9)
      ]
    }));
    addToast({ message: `${action} +${points} 积分`, type: "success" });
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* 用户概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <CardBody className="flex flex-row items-center gap-4">
            <Avatar src={userProfile.avatar} size="lg" />
            <div>
              <h3 className="text-lg font-semibold">{userProfile.name}</h3>
              <Chip color={membershipLevels[userProfile.level].color} size="sm">
                {membershipLevels[userProfile.level].name}
              </Chip>
            </div>
          </CardBody>
        </Card>
        
        <Card className="p-4">
          <CardBody className="text-center">
            <h4 className="text-2xl font-bold text-primary">{userProfile.points}</h4>
            <p className="text-sm text-gray-500">Mastera Points</p>
          </CardBody>
        </Card>
        
        <Card className="p-4">
          <CardBody className="text-center">
            <h4 className="text-2xl font-bold text-secondary">{userProfile.badges.length}</h4>
            <p className="text-sm text-gray-500">获得徽章</p>
          </CardBody>
        </Card>
      </div>

      {/* 每日任务 */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">每日任务</h3>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="flex justify-between items-center">
            <span>每日登录</span>
            <Button size="sm" color="success" onPress={() => handlePointsAction("每日登录", 10)}>
              +10 积分
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <span>发布评论</span>
            <Button size="sm" color="primary" onPress={() => handlePointsAction("发布评论", 5)}>
              +5 积分
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <span>分享内容</span>
            <Button size="sm" color="secondary" onPress={() => handlePointsAction("分享内容", 15)}>
              +15 积分
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* 热门内容 */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">热门内容</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contentTypes.map((content) => (
              <Card key={content.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">
                      {content.type === 'visual' && '🎨'}
                      {content.type === 'audio' && '🎵'}
                      {content.type === 'animation' && '🎬'}
                      {content.type === 'photography' && '📸'}
                    </span>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <h4 className="font-semibold text-sm">{content.title}</h4>
                  <p className="text-xs text-gray-500">by {content.author}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs">{content.downloads} 下载</span>
                    {content.premium && <Chip size="sm" color="warning">Premium</Chip>}
                  </div>
                </CardBody>
                <CardFooter className="pt-0">
                  <Button size="sm" className="w-full" onPress={onContentOpen}>
                    查看详情
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderUserSystem = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">用户档案</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar src={userProfile.avatar} size="xl" />
            <div className="flex-1">
              <h4 className="text-xl font-semibold">{userProfile.name}</h4>
              <Chip color={membershipLevels[userProfile.level].color} className="mt-1">
                {membershipLevels[userProfile.level].name}
              </Chip>
              <div className="mt-2">
                <p className="text-sm text-gray-600">会员权益：</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {membershipLevels[userProfile.level].benefits.map((benefit, index) => (
                    <Chip key={index} size="sm" variant="flat">{benefit}</Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <Divider />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold mb-2">积分余额</h5>
              <div className="text-2xl font-bold text-primary">{userProfile.points} 积分</div>
              <Progress value={65} className="mt-2" color="primary" />
              <p className="text-xs text-gray-500 mt-1">距离下一等级还需 420 积分</p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-2">等级徽章</h5>
              <div className="flex flex-wrap gap-2">
                {userProfile.badges.map((badge, index) => (
                  <Badge key={index} content="✓" color="success">
                    <Chip size="sm" variant="flat">{badge}</Chip>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">活跃记录</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="活跃记录表格">
            <TableHeader>
              <TableColumn>操作</TableColumn>
              <TableColumn>积分</TableColumn>
              <TableColumn>时间</TableColumn>
            </TableHeader>
            <TableBody>
              {userProfile.activityLog.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    <Chip size="sm" color="success">+{log.points}</Chip>
                  </TableCell>
                  <TableCell>{log.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );

  const renderContentSystem = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex justify-between">
          <h3 className="text-lg font-semibold">内容库</h3>
          <Select placeholder="筛选类型" className="w-48">
            <SelectItem key="all">全部内容</SelectItem>
            <SelectItem key="visual">视觉内容</SelectItem>
            <SelectItem key="audio">音频流媒体</SelectItem>
            <SelectItem key="premium">付费内容包</SelectItem>
          </Select>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentTypes.map((content) => (
              <Card key={content.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                    <span className="text-6xl">
                      {content.type === 'visual' && '🎨'}
                      {content.type === 'audio' && '🎵'}
                      {content.type === 'animation' && '🎬'}
                      {content.type === 'photography' && '📸'}
                    </span>
                  </div>
                </CardHeader>
                <CardBody>
                  <h4 className="font-semibold">{content.title}</h4>
                  <p className="text-sm text-gray-500">创作者: {content.author}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm">{content.downloads} 次下载</span>
                    {content.premium && <Chip size="sm" color="warning">Premium</Chip>}
                  </div>
                </CardBody>
                <CardFooter className="gap-2">
                  <Button size="sm" variant="flat" className="flex-1">预览</Button>
                  <Button size="sm" color="primary" className="flex-1">
                    {content.premium ? "解锁下载" : "免费下载"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderCommunity = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Mastera Circle</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {["艺术创作圈", "音乐制作圈", "摄影交流圈", "动画设计圈"].map((circle, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardBody className="text-center p-6">
                  <div className="text-4xl mb-3">
                    {index === 0 && '🎨'}
                    {index === 1 && '🎵'}
                    {index === 2 && '📸'}
                    {index === 3 && '🎬'}
                  </div>
                  <h4 className="font-semibold">{circle}</h4>
                  <p className="text-sm text-gray-500 mt-1">{Math.floor(Math.random() * 1000) + 500} 成员</p>
                  <Button size="sm" className="mt-3" color="primary">加入圈子</Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Creator Live & AMA</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {[
              { creator: "知名插画师", topic: "数字艺术创作技巧分享", time: "今晚 8:00 PM", viewers: 1234 },
              { creator: "独立音乐人", topic: "音乐制作与发行经验", time: "明天 7:30 PM", viewers: 856 },
              { creator: "摄影大师", topic: "人像摄影光影技巧", time: "周五 6:00 PM", viewers: 642 }
            ].map((live, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h5 className="font-semibold">{live.topic}</h5>
                    <p className="text-sm text-gray-500">主播: {live.creator}</p>
                    <p className="text-sm text-primary">{live.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{live.viewers} 预约</p>
                    <Button size="sm" color="secondary" className="mt-2">预约直播</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderPointsSystem = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">积分获取</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>每日登录</span>
              <Chip color="success">+10</Chip>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>发布评论</span>
              <Chip color="success">+5</Chip>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>收藏内容</span>
              <Chip color="success">+3</Chip>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>分享内容</span>
              <Chip color="success">+15</Chip>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>邀请好友</span>
              <Chip color="success">+100</Chip>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">积分兑换</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>下载券 (1张)</span>
              <Button size="sm" color="primary">50 积分</Button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>演唱会门票</span>
              <Button size="sm" color="secondary">500 积分</Button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>会员升级券</span>
              <Button size="sm" color="warning">1000 积分</Button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>专属活动资格</span>
              <Button size="sm" color="danger">2000 积分</Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">积分排行榜</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="积分排行榜">
            <TableHeader>
              <TableColumn>排名</TableColumn>
              <TableColumn>用户</TableColumn>
              <TableColumn>积分</TableColumn>
              <TableColumn>等级</TableColumn>
            </TableHeader>
            <TableBody>
              {[
                { rank: 1, name: "创作达人_01", points: 15680, level: "VIP" },
                { rank: 2, name: "艺术家_02", points: 12450, level: "ArtCircle" },
                { rank: 3, name: "音乐人_03", points: 9870, level: "Creator+" },
                { rank: 4, name: userProfile.name, points: userProfile.points, level: membershipLevels[userProfile.level].name },
                { rank: 5, name: "摄影师_05", points: 2100, level: "Creator+" }
              ].map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Chip size="sm" color={user.rank <= 3 ? "warning" : "default"}>
                      #{user.rank}
                    </Chip>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.points}</TableCell>
                  <TableCell>
                    <Chip size="sm" color="primary">{user.level}</Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );

  const renderCreatorSystem = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <CardBody className="text-center">
            <h4 className="text-2xl font-bold text-primary">23</h4>
            <p className="text-sm text-gray-500">发布作品</p>
          </CardBody>
        </Card>
        <Card className="p-4">
          <CardBody className="text-center">
            <h4 className="text-2xl font-bold text-secondary">1,234</h4>
            <p className="text-sm text-gray-500">总下载量</p>
          </CardBody>
        </Card>
        <Card className="p-4">
          <CardBody className="text-center">
            <h4 className="text-2xl font-bold text-warning">¥856</h4>
            <p className="text-sm text-gray-500">本月收益</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex justify-between">
          <h3 className="text-lg font-semibold">内容管理</h3>
          <Button color="primary">上传新作品</Button>
        </CardHeader>
        <CardBody>
          <Table aria-label="作品管理表格">
            <TableHeader>
              <TableColumn>作品名称</TableColumn>
              <TableColumn>类型</TableColumn>
              <TableColumn>下载量</TableColumn>
              <TableColumn>收益</TableColumn>
              <TableColumn>状态</TableColumn>
              <TableColumn>操作</TableColumn>
            </TableHeader>
            <TableBody>
              {[
                { name: "数字艺术作品集", type: "视觉", downloads: 456, revenue: "¥123", status: "已发布" },
                { name: "原创音乐专辑", type: "音频", downloads: 234, revenue: "¥89", status: "审核中" },
                { name: "3D动画短片", type: "动画", downloads: 678, revenue: "¥234", status: "已发布" }
              ].map((work, index) => (
                <TableRow key={index}>
                  <TableCell>{work.name}</TableCell>
                  <TableCell>{work.type}</TableCell>
                  <TableCell>{work.downloads}</TableCell>
                  <TableCell>{work.revenue}</TableCell>
                  <TableCell>
                    <Chip size="sm" color={work.status === "已发布" ? "success" : "warning"}>
                      {work.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="flat">编辑</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-lime-400/20 to-green-400/20 rounded-2xl p-8 mb-8 border border-lime-400/30">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              欢迎来到 <span className="text-lime-400">Mastera Platform</span>
            </h1>
            <p className="text-gray-300 text-lg">
              连接创作者与粉丝的创意平台，让每个人都能发现和分享精彩内容
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <Button 
              color="primary" 
              size="lg"
              className="bg-lime-400 text-black font-semibold"
              onPress={() => window.location.href = '/onboarding'}
            >
              开始探索
            </Button>
            <Button 
              variant="bordered"
              size="lg"
              className="border-lime-400 text-lime-400 hover:bg-lime-400/10"
              onPress={() => window.location.href = '/creator'}
            >
              成为创作者
            </Button>
          </div>
        </div>
      </div>

    {/* 主要内容区域 */}
    <div className="space-y-8">
      <Tabs 
        selectedKey={activeTab} 
        onSelectionChange={setActiveTab}
        className="w-full"
        color="primary"
      >
        <Tab key="dashboard" title="🏠 仪表盘">
          {renderDashboard()}
        </Tab>
        <Tab key="user" title="👤 用户系统">
          {renderUserSystem()}
        </Tab>
        <Tab key="content" title="📚 内容体系">
          {renderContentSystem()}
        </Tab>
        <Tab key="community" title="🌐 社区互动">
          {renderCommunity()}
        </Tab>
        <Tab key="points" title="⭐ 积分系统">
          {renderPointsSystem()}
        </Tab>
        <Tab key="creator" title="🎨 创作者中心">
          {renderCreatorSystem()}
        </Tab>
      </Tabs>
    </div>

      {/* 用户档案模态框 */}
      <Modal isOpen={isProfileOpen} onOpenChange={onProfileOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>用户档案详情</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar src={userProfile.avatar} size="xl" />
                    <div>
                      <h4 className="text-xl font-semibold">{userProfile.name}</h4>
                      <Chip color={membershipLevels[userProfile.level].color}>
                        {membershipLevels[userProfile.level].name}
                      </Chip>
                    </div>
                  </div>
                  <Divider />
                  <div>
                    <h5 className="font-semibold mb-2">会员权益</h5>
                    <div className="grid grid-cols-1 gap-2">
                      {membershipLevels[userProfile.level].benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  关闭
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* 内容详情模态框 */}
      <Modal isOpen={isContentOpen} onOpenChange={onContentOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>内容详情</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                    <span className="text-8xl">🎨</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">精美数字艺术作品</h4>
                    <p className="text-gray-500">创作者: Artist_01</p>
                    <div className="flex gap-2 mt-2">
                      <Chip size="sm">数字艺术</Chip>
                      <Chip size="sm">插画</Chip>
                      <Chip size="sm">原创</Chip>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    这是一幅精美的数字艺术作品，展现了现代艺术与传统文化的完美融合。
                    作品采用了先进的数字绘画技术，色彩丰富，层次分明。
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={onClose}>
                  立即下载
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
