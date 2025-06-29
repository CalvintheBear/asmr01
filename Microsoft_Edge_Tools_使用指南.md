# Microsoft Edge Tools for VS Code 使用指南

## 🌟 插件功能概述

Microsoft Edge Tools for VS Code 让你可以：
- 在VS Code中直接调试Edge浏览器
- 实时预览和编辑网页
- 设置断点调试JavaScript
- 查看控制台日志
- 检查元素和CSS样式
- 调试网络请求

## 🚀 快速开始

### 1. 基本调试步骤

1. **打开调试面板**: `Ctrl+Shift+D` (Windows) 或 `Cmd+Shift+D` (Mac)
2. **选择调试配置**: 在下拉菜单中选择以下配置之一
3. **点击绿色播放按钮**开始调试

### 2. 可用的调试配置

#### 🔹 Microsoft Edge 调试
- **用途**: 调试运行在 localhost:3000 的应用
- **适用场景**: Next.js、React、Vue等开发服务器
- **使用步骤**:
  1. 启动你的开发服务器 (`npm run dev`)
  2. 选择"Microsoft Edge 调试"配置
  3. 按F5启动调试

#### 🔹 Edge 调试当前文件
- **用途**: 直接调试当前打开的HTML文件
- **适用场景**: 静态HTML页面、简单的前端项目
- **使用步骤**:
  1. 打开一个HTML文件
  2. 选择"Edge 调试当前文件"配置
  3. 按F5启动调试

#### 🔹 Edge 附加到现有实例
- **用途**: 连接到已经运行的Edge浏览器实例
- **适用场景**: 调试已经打开的网页
- **使用步骤**:
  1. 用调试模式启动Edge: `msedge --remote-debugging-port=9222`
  2. 选择"Edge 附加到现有实例"配置
  3. 按F5连接

#### 🔹 Next.js Edge 调试
- **用途**: 专门为Next.js项目优化的调试配置
- **适用场景**: Next.js应用开发
- **特性**: 包含Source Map路径映射

## 🛠️ 调试功能详解

### 断点调试
```javascript
// 在JavaScript代码中设置断点
function handleClick() {
    console.log('按钮被点击'); // 👈 在这里设置断点
    const data = fetchData();
    processData(data);
}
```

### 实时编辑
- **CSS**: 在开发者工具中直接修改样式
- **JavaScript**: 在控制台中执行代码
- **HTML**: 查看DOM结构变化

### 网络监控
- 查看所有HTTP请求
- 分析请求头和响应
- 监控API调用

## 📝 实际使用示例

### 示例1: 调试Next.js应用
```bash
# 1. 启动开发服务器
npm run dev

# 2. 在VS Code中:
# - 按Ctrl+Shift+D打开调试面板
# - 选择"Next.js Edge 调试"
# - 按F5启动调试
```

### 示例2: 调试HTML文件
```html
<!DOCTYPE html>
<html>
<head>
    <title>测试页面</title>
</head>
<body>
    <button onclick="testFunction()">点击测试</button>
    <script>
        function testFunction() {
            console.log('测试函数被调用'); // 👈 设置断点
            alert('Hello World!');
        }
    </script>
</body>
</html>
```

## 🔧 高级配置

### 自定义端口
```json
{
    "name": "自定义端口调试",
    "type": "vscode-edge-devtools.debug",
    "request": "launch",
    "url": "http://localhost:8080", // 👈 修改端口
    "webRoot": "${workspaceFolder}"
}
```

### 添加启动参数
```json
{
    "name": "带参数的Edge调试",
    "type": "vscode-edge-devtools.debug",
    "request": "launch",
    "url": "http://localhost:3000",
    "webRoot": "${workspaceFolder}",
    "runtimeArgs": [
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor"
    ]
}
```

## 🎯 常用快捷键

| 功能 | 快捷键 |
|------|--------|
| 开始/停止调试 | `F5` |
| 重启调试 | `Ctrl+Shift+F5` |
| 步进 | `F10` |
| 步入 | `F11` |
| 步出 | `Shift+F11` |
| 继续执行 | `F5` |
| 设置/取消断点 | `F9` |

## 💡 实用技巧

### 1. 条件断点
- 右键点击行号 → "添加条件断点"
- 输入条件，如: `x > 10`

### 2. 日志点
- 右键点击行号 → "添加日志点"
- 输入要记录的表达式

### 3. 查看变量
- 鼠标悬停在变量上查看值
- 使用"变量"面板查看作用域内所有变量

### 4. 控制台调试
- 在调试时可以在控制台中执行任意JavaScript代码
- 使用 `console.log()` 输出调试信息

## 🚨 常见问题

### 问题1: 无法连接到Edge
**解决方案**: 
- 确保Edge浏览器已关闭
- 检查端口是否被占用
- 重启VS Code

### 问题2: 断点不生效
**解决方案**:
- 确保Source Map已生成
- 检查webRoot路径是否正确
- 清除浏览器缓存

### 问题3: 找不到调试配置
**解决方案**:
- 确保插件已安装并启用
- 检查launch.json文件格式
- 重新加载VS Code窗口

## 🔄 与其他工具集成

### 与Git配合
- 调试时可以查看代码变更
- 使用Git blame查看代码作者

### 与ESLint配合
- 实时查看代码质量问题
- 在调试时修复lint错误

### 与TypeScript配合
- 支持TypeScript源映射
- 可以在.ts文件中直接设置断点

## 📈 性能分析

### 内存使用分析
- 查看内存使用情况
- 检测内存泄漏

### 性能面板
- 分析页面加载时间
- 查看JavaScript执行性能

---

💡 **提示**: 这个插件特别适合前端开发者，可以大大提高调试效率。建议结合使用断点、控制台和网络面板来全面分析问题。 