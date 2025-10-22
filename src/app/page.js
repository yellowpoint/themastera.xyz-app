"use client";
import React from "react";
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Checkbox,
  RadioGroup,
  Radio,
  Switch,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tabs,
  Tab,
  Accordion,
  AccordionItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Progress,
  Spinner,
  Avatar,
  Badge,
  Breadcrumbs,
  BreadcrumbItem,
  Chip,
  Divider,
  Pagination,
} from "@heroui/react";
import { addToast } from "@heroui/toast";

export default function Home() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // 添加表格数据与分页/加载状态
  const rows = React.useMemo(
    () => [
      { id: 1, name: "张三", city: "北京", age: 28, department: "研发", status: "active", email: "zhangsan@example.com", joinDate: "2022-03-12", tags: ["前端", "React"] },
      { id: 2, name: "李四", city: "上海", age: 32, department: "产品", status: "inactive", email: "lisi@example.com", joinDate: "2021-08-01", tags: ["需求", "PRD"] },
      { id: 3, name: "王五", city: "广州", age: 24, department: "设计", status: "pending", email: "wangwu@example.com", joinDate: "2023-01-20", tags: ["UI", "动效"] },
      { id: 4, name: "赵六", city: "深圳", age: 30, department: "测试", status: "active", email: "zhaoliu@example.com", joinDate: "2020-11-05", tags: ["自动化", "CI"] },
      { id: 5, name: "孙七", city: "杭州", age: 26, department: "运营", status: "active", email: "sunqi@example.com", joinDate: "2019-07-14", tags: ["内容", "活动"] },
      { id: 6, name: "周八", city: "成都", age: 34, department: "市场", status: "inactive", email: "zhouba@example.com", joinDate: "2018-05-29", tags: ["渠道", "品牌"] },
      { id: 7, name: "吴九", city: "南京", age: 27, department: "研发", status: "active", email: "wujiu@example.com", joinDate: "2022-10-09", tags: ["后端", "Node.js"] },
      { id: 8, name: "郑十", city: "苏州", age: 29, department: "研发", status: "pending", email: "zhengshi@example.com", joinDate: "2023-06-18", tags: ["数据", "Python"] },
      { id: 9, name: "王十一", city: "重庆", age: 31, department: "设计", status: "active", email: "wang11@example.com", joinDate: "2017-04-23", tags: ["UX", "规范"] },
      { id: 10, name: "陈十二", city: "武汉", age: 25, department: "测试", status: "inactive", email: "chen12@example.com", joinDate: "2021-12-31", tags: ["接口", "性能"] },
      { id: 11, name: "钱十三", city: "西安", age: 33, department: "产品", status: "active", email: "qian13@example.com", joinDate: "2016-09-10", tags: ["迭代", "Roadmap"] },
      { id: 12, name: "刘十四", city: "长沙", age: 28, department: "运营", status: "pending", email: "liu14@example.com", joinDate: "2022-02-02", tags: ["社媒", "投放"] },
      { id: 13, name: "黄十五", city: "合肥", age: 26, department: "市场", status: "active", email: "huang15@example.com", joinDate: "2020-03-03", tags: ["活动", "公关"] },
      { id: 14, name: "魏十六", city: "青岛", age: 35, department: "研发", status: "inactive", email: "wei16@example.com", joinDate: "2015-01-15", tags: ["架构", "DevOps"] },
      { id: 15, name: "蒋十七", city: "大连", age: 23, department: "设计", status: "active", email: "jiang17@example.com", joinDate: "2023-07-07", tags: ["插画", "品牌"] },
      { id: 16, name: "沈十八", city: "厦门", age: 29, department: "测试", status: "pending", email: "shen18@example.com", joinDate: "2019-10-20", tags: ["安全", "渗透"] },
      { id: 17, name: "韩十九", city: "天津", age: 28, department: "产品", status: "active", email: "han19@example.com", joinDate: "2018-08-08", tags: ["分析", "竞品"] },
      { id: 18, name: "杨二十", city: "无锡", age: 30, department: "运营", status: "inactive", email: "yang20@example.com", joinDate: "2017-10-11", tags: ["增长", "留存"] },
      { id: 19, name: "朱二一", city: "佛山", age: 27, department: "市场", status: "active", email: "zhu21@example.com", joinDate: "2022-01-01", tags: ["SEO", "SEM"] },
      { id: 20, name: "秦二二", city: "东莞", age: 32, department: "研发", status: "active", email: "qin22@example.com", joinDate: "2019-09-09", tags: ["算法", "AI"] },
      { id: 21, name: "许二三", city: "佛山", age: 24, department: "产品", status: "pending", email: "xu23@example.com", joinDate: "2021-05-03", tags: ["原型", "访谈"] },
      { id: 22, name: "何二四", city: "宁波", age: 31, department: "设计", status: "active", email: "he24@example.com", joinDate: "2020-12-12", tags: ["视觉", "动效"] },
      { id: 23, name: "吕二五", city: "福州", age: 33, department: "测试", status: "inactive", email: "lv25@example.com", joinDate: "2017-06-06", tags: ["质量", "流程"] },
      { id: 24, name: "施二六", city: "南昌", age: 28, department: "运营", status: "active", email: "shi26@example.com", joinDate: "2018-03-13", tags: ["转化", "A/B"] },
      { id: 25, name: "张二七", city: "沈阳", age: 34, department: "市场", status: "pending", email: "zhang27@example.com", joinDate: "2016-11-30", tags: ["活动", "线下"] },
      { id: 26, name: "李二八", city: "石家庄", age: 26, department: "研发", status: "active", email: "li28@example.com", joinDate: "2020-04-04", tags: ["Java", "微服务"] },
      { id: 27, name: "王二九", city: "郑州", age: 25, department: "设计", status: "inactive", email: "wang29@example.com", joinDate: "2018-12-25", tags: ["体验", "设计系统"] },
      { id: 28, name: "赵三十", city: "太原", age: 29, department: "产品", status: "active", email: "zhao30@example.com", joinDate: "2019-02-14", tags: ["路线图", "KPI"] },
      { id: 29, name: "孙三一", city: "长春", age: 30, department: "测试", status: "pending", email: "sun31@example.com", joinDate: "2021-01-18", tags: ["集成", "回归"] },
      { id: 30, name: "周三二", city: "昆明", age: 27, department: "运营", status: "active", email: "zhou32@example.com", joinDate: "2022-09-28", tags: ["裂变", "私域"] },
    ],
    []
  );
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;
  const pages = Math.ceil(rows.length / rowsPerPage);
  const [isTableLoading, setIsTableLoading] = React.useState(false);
  // 表单（Form 示例）状态
  const [formUsername, setFormUsername] = React.useState("");
  const [formEmail, setFormEmail] = React.useState("");
  const [formBio, setFormBio] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState(new Set([]));
  const [agree, setAgree] = React.useState(true);
  const [notify, setNotify] = React.useState(true);
  const [gender, setGender] = React.useState("male");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // 主题切换状态
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    // 初始化主题：优先本地存储，其次系统偏好
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
      const prefersDark = typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : false;
      const initialDark = stored ? stored === "dark" : prefersDark;
      setIsDark(initialDark);
      const root = document.documentElement;
      if (initialDark) root.classList.add("dark");
      else root.classList.remove("dark");
    } catch {}
  }, []);
  const visibleRows = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return rows.slice(start, end);
  }, [page, rows]);

  return (
    <div className="font-sans min-h-screen p-8 sm:p-12 bg-background text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* 顶部导航/路径 */}
        <Breadcrumbs>
          <BreadcrumbItem>首页</BreadcrumbItem>
          <BreadcrumbItem>HeroUI组件示例</BreadcrumbItem>
        </Breadcrumbs>
        {/* 主题切换 */}
        <div className="flex justify-end">
          // ...existing code...
          -           {/* 已移除 ThemeSwitch，占位保持布局一致 */}
          +           {/* 已移除 ThemeSwitch，占位保持布局一致 */}
        </div>
        {/* 主题切换（Switch 控制）*/}
        <div className="flex justify-end">
          <Switch
            size="sm"
            isSelected={isDark}
            onValueChange={(val) => {
              setIsDark(val);
              const root = document.documentElement;
              if (val) {
                root.classList.add("dark");
                try { localStorage.setItem("theme", "dark"); } catch {}
              } else {
                root.classList.remove("dark");
                try { localStorage.setItem("theme", "light"); } catch {}
              }
            }}
          >
            深色模式
          </Switch>
        </div>
        {/* 按钮 & Tooltip */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">按钮与提示</h2>
          <div className="flex flex-wrap gap-3">
            <Button color="primary">Primary</Button>
            <Button className="btn-square" aria-label="square-32" variant="flat">+</Button>
            <Button variant="bordered">Bordered</Button>
            <Button color="secondary" variant="flat">Secondary</Button>
            <Tooltip content="这是一个按钮提示">
              <Button>Hover 我</Button>
            </Tooltip>
            <Chip color="success">Chip 标签</Chip>
            <Button
              color="success"
              onPress={() =>
                addToast({
                  title: "操作成功",
                  description: "这是一个顶部中间的 Toast 提示",
                  color: "success",
                })
              }
            >
              显示 Toast
            </Button>
          </div>
        </section>

        <Divider />

        {/* 表单控件 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">表单控件</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="用户名" placeholder="输入用户名" />
            <Input type="password" label="密码" placeholder="输入密码" />
            <Textarea label="简介" placeholder="简单介绍一下你自己" />
            <Select label="选择城市" placeholder="请选择">
              <SelectItem key="bj" value="bj">北京</SelectItem>
              <SelectItem key="sh" value="sh">上海</SelectItem>
              <SelectItem key="gz" value="gz">广州</SelectItem>
            </Select>
            <div className="flex items-center gap-6">
              <Checkbox defaultSelected>同意协议</Checkbox>
              <Switch defaultSelected>启用通知</Switch>
            </div>
            <RadioGroup label="性别" orientation="horizontal" defaultValue="male">
              <Radio value="male">男</Radio>
              <Radio value="female">女</Radio>
            </RadioGroup>
          </div>
        </section>

        <Divider />

        {/* 表单（Form 示例） */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">表单（Form 示例）</h2>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              // 简单校验逻辑
              const cityValue = Array.from(selectedCity)[0] || "";
              if (!formUsername || !formEmail || !cityValue) {
                addToast({
                  title: "提交失败",
                  description: "请填写必填字段：用户名、邮箱、城市",
                  color: "danger",
                });
                return;
              }
              if (!formEmail.includes("@")) {
                addToast({
                  title: "邮箱不合法",
                  description: "请填写正确的邮箱地址",
                  color: "warning",
                });
                return;
              }
              setIsSubmitting(true);
              setTimeout(() => {
                setIsSubmitting(false);
                addToast({
                  title: "提交成功",
                  description: `用户：${formUsername}，城市：${cityValue}`,
                  color: "success",
                });
                // 重置
                setFormUsername("");
                setFormEmail("");
                setFormBio("");
                setSelectedCity(new Set([]));
                setAgree(true);
                setNotify(true);
                setGender("male");
              }, 800);
            }}
          >
            <Input label="用户名" labelPlacement="outside" placeholder="输入用户名" value={formUsername} onChange={(e) => setFormUsername(e.target.value)} isRequired />
            <Input type="email" label="邮箱" labelPlacement="outside" placeholder="输入邮箱" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} isRequired />
            <Textarea label="简介" labelPlacement="outside" placeholder="填写简介" value={formBio} onChange={(e) => setFormBio(e.target.value)} className="md:col-span-2" />
            <Select label="选择城市" labelPlacement="outside" placeholder="请选择" selectedKeys={selectedCity} onSelectionChange={setSelectedCity}>
              <SelectItem key="bj" value="bj">北京</SelectItem>
              <SelectItem key="sh" value="sh">上海</SelectItem>
              <SelectItem key="gz" value="gz">广州</SelectItem>
            </Select>
            <div className="flex items-center gap-6">
              <Checkbox isSelected={agree} onValueChange={setAgree}>同意协议</Checkbox>
              <Switch isSelected={notify} onValueChange={setNotify}>启用通知</Switch>
            </div>
            <RadioGroup label="性别" orientation="horizontal" value={gender} onValueChange={setGender} className="md:col-span-2">
              <Radio value="male">男</Radio>
              <Radio value="female">女</Radio>
            </RadioGroup>
            <div className="md:col-span-2">
              <Button type="submit" color="primary" isDisabled={isSubmitting}>
                {isSubmitting ? "提交中..." : "提交"}
              </Button>
            </div>
          </form>
        </section>

        <Divider />

        {/* 卡片 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">卡片</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="font-semibold">欢迎使用 HeroUI</CardHeader>
              <CardBody>快速构建优雅的 React 应用。</CardBody>
              <CardFooter>
                <Button size="sm" color="primary" onPress={onOpen}>打开模态框</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>进度与加载</CardHeader>
              <CardBody className="space-y-3">
                <Progress aria-label="下载进度" value={60} color="primary" />
                <div className="flex items-center gap-3">
                  <Spinner size="sm" label="加载中" />
                  <Chip variant="flat">等待数据...</Chip>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>用户</CardHeader>
              <CardBody>
                <div className="flex items-center gap-6">
                  <Badge content="5" color="primary">
                    <Avatar name="Zhang San" />
                  </Badge>
                  <Avatar src="/vercel.svg" name="Logo" />
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        {/* 模态框 */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>模态框标题</ModalHeader>
                <ModalBody>这里是模态框的内容示例。</ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>取消</Button>
                  <Button color="primary" onPress={onClose}>确定</Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Divider />

        {/* Tabs 选项卡 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">选项卡</h2>
          <Tabs aria-label="示例Tabs" color="primary">
            <Tab key="tab1" title="Tab 1">
              <p>第一个选项卡内容。</p>
            </Tab>
            <Tab key="tab2" title="Tab 2">
              <p>第二个选项卡内容。</p>
            </Tab>
            <Tab key="tab3" title="Tab 3">
              <p>第三个选项卡内容。</p>
            </Tab>
          </Tabs>
        </section>

        <Divider />

        {/* 手风琴 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">手风琴</h2>
          <Accordion selectionMode="multiple" defaultSelectedKeys={["a1"]}>
            <AccordionItem key="a1" title="面板一">
              面板一的内容。
            </AccordionItem>
            <AccordionItem key="a2" title="面板二">
              面板二的内容。
            </AccordionItem>
            <AccordionItem key="a3" title="面板三">
              面板三的内容。
            </AccordionItem>
          </Accordion>
        </section>

        <Divider />

        {/* 表格 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">表格</h2>
          <div className="relative overflow-hidden">
            <Table
              aria-label="示例表格"
              bottomContent={
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    page={page}
                    total={pages}
                    onChange={setPage}
                  />
                </div>
              }
            >
              <TableHeader>
                <TableColumn>姓名</TableColumn>
                <TableColumn>城市</TableColumn>
                <TableColumn>年龄</TableColumn>
                <TableColumn>部门</TableColumn>
                <TableColumn>状态</TableColumn>
                <TableColumn>邮箱</TableColumn>
                <TableColumn>入职时间</TableColumn>
                <TableColumn>标签</TableColumn>
              </TableHeader>
              <TableBody
                isLoading={isTableLoading}
                loadingContent={<Spinner label="加载中..." />}
              >
                {visibleRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.city}</TableCell>
                    <TableCell>{row.age}</TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>
                      <Chip
                        color={row.status === "active" ? "success" : row.status === "pending" ? "warning" : "default"}
                        variant="flat"
                      >
                        {row.status}
                      </Chip>
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.joinDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {row.tags.map((tag, i) => (
                          <Chip key={`${row.id}-${i}`} size="sm" variant="flat">{tag}</Chip>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {isTableLoading && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-black/20" />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
