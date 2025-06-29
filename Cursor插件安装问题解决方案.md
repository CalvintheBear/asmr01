# 🔧 Cursor编辑器插件安装失败解决方案

## 🚨 **问题分析**
根据错误日志，你遇到的是Cursor编辑器连接 `marketplace.cursorapi.com` 失败的问题。

### 错误特征：
- TypeError: Failed to fetch
- 无法连接到 marketplace.cursorapi.com
- 多个workbench相关文件下载失败

---

## 🎯 **解决方案（按推荐程度排序）**

### 🥇 **方案1: 使用VS Code + Live Server（强烈推荐）**

由于Cursor市场连接有问题，建议切换到标准VS Code：

#### 步骤：
1. **下载VS Code**
   ```
   https://code.visualstudio.com/
   ```

2. **安装必要插件**
   - Live Server
   - Microsoft Edge Tools for VS Code

3. **使用Live Server调试**
   - 右键HTML文件 → "Open with Live Server"
   - 避免了file://协议的安全限制

### 🥈 **方案2: 修复Cursor网络连接**

#### 2.1 使用VPN或代理
```powershell
# 如果有VPN，尝试连接后再安装插件
```

#### 2.2 修改DNS设置
```powershell
# 尝试使用公共DNS
# 控制面板 → 网络 → 更改适配器设置 → 属性 → IPv4
# 设置DNS为: 8.8.8.8 和 8.8.4.4
```

#### 2.3 清除Cursor缓存
```powershell
# 关闭Cursor，然后删除缓存目录
rm -r "$env:APPDATA\Cursor\User\workspaceStorage" -ErrorAction SilentlyContinue
rm -r "$env:APPDATA\Cursor\logs" -ErrorAction SilentlyContinue
```

### 🥉 **方案3: 手动安装插件**

#### 3.1 下载VSIX文件
从VS Code市场手动下载插件的.vsix文件：
```
https://marketplace.visualstudio.com/items?itemName=ms-edgedevtools.vscode-edge-devtools
```

#### 3.2 手动安装
1. 在Cursor中按 `Ctrl+Shift+P`
2. 输入 "Extensions: Install from VSIX"
3. 选择下载的.vsix文件

### 🔄 **方案4: 替代方案 - 浏览器调试**

如果插件安装仍然有问题，直接使用浏览器调试：

#### Edge DevTools调试：
1. 打开Edge浏览器
2. 按F12打开开发者工具
3. 在VS Code/Cursor中编辑代码
4. 在浏览器中实时调试

#### Chrome DevTools调试：
1. 安装Chrome
2. 使用Chrome DevTools
3. 同样的调试体验

---

## 🚀 **推荐操作流程**

### 立即可行方案：
```
1. 下载并安装标准VS Code
2. 安装Live Server插件
3. 使用Live Server + Edge调试
4. 继续你的开发工作
```

### 长期解决：
```
1. 检查网络环境
2. 考虑使用VPN
3. 或继续使用VS Code代替Cursor
```

---

## 🔧 **网络问题排查**

### 检查连接状态：
```powershell
# 测试Cursor市场连接
ping marketplace.cursorapi.com

# 测试VS Code市场连接  
ping marketplace.visualstudio.com

# 检查DNS解析
nslookup marketplace.cursorapi.com
```

### 临时网络修复：
```powershell
# 刷新DNS缓存
ipconfig /flushdns

# 重置网络设置
netsh winsock reset
netsh int ip reset
```

---

## 💡 **为什么推荐VS Code？**

1. **更稳定的插件市场** - 微软官方维护
2. **更好的网络连接** - 全球CDN支持  
3. **更多的插件选择** - 生态系统更完善
4. **更好的调试体验** - 原生支持各种调试工具

---

## 🎮 **测试验证**

### VS Code + Live Server测试：
- [ ] 安装VS Code
- [ ] 安装Live Server插件
- [ ] 安装Microsoft Edge Tools
- [ ] 测试 `test-edge-debug.html` 调试功能
- [ ] 验证断点、变量查看等功能

### 网络连通性测试：
- [ ] ping marketplace.visualstudio.com ✅
- [ ] ping marketplace.cursorapi.com ❌
- [ ] 访问 https://marketplace.visualstudio.com ✅

---

## 📞 **需要帮助？**

如果继续遇到问题：
1. 提供网络环境详情（是否使用公司网络、VPN等）
2. 说明是否可以访问其他海外网站
3. 确认防火墙/杀毒软件设置

💡 **建议**: 现阶段使用VS Code + Live Server是最快的解决方案！ 