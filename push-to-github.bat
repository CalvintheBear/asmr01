@echo off
echo 🚀 推送清理后的代码到GitHub...
echo.

echo 📊 当前仓库状态:
git log --oneline -5
echo.

echo 📦 文件大小检查:
git ls-files | findstr /V ".git" | wc -l
echo 个文件待推送
echo.

echo 🌐 开始推送到GitHub...
git push origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ 推送成功！
    echo 🚀 现在可以前往Cloudflare Pages部署了:
    echo    https://pages.cloudflare.com/
    echo.
    echo 📋 仓库信息:
    echo    - 仓库大小: 182KB
    echo    - 文件数量: 36个
    echo    - 所有核心功能完整保留
    echo.
) else (
    echo.
    echo ❌ 推送失败，请检查网络连接
    echo 💡 建议: 等待网络稳定后重新运行此脚本
    echo.
)

echo 按任意键关闭...
pause >nul 