# 🚀 独立站部署指南

## 📋 部署步骤

### 第一步：安装 Vercel CLI
```bash
npm install -g vercel
```

### 第二步：部署后端 API
```bash
cd E:\Projects\foreign-trade-platform\backend
vercel --prod
```
- 选择项目名称：`dayileather-api`
- 确认部署设置
- 记录生成的 API 域名

### 第三步：部署前端网站
```bash
cd E:\Projects\foreign-trade-platform\frontend
vercel --prod
```
- 选择项目名称：`dayileather`
- 确认部署设置
- 记录生成的网站域名

### 第四步：配置自定义域名（可选）
1. 在 Vercel 控制台添加自定义域名
2. 配置 DNS 解析
3. 自动获得 SSL 证书

## 🌐 部署后的访问地址

### 临时域名（立即可用）
- **网站**：https://dayileather.vercel.app
- **API**：https://dayileather-api.vercel.app

### 推荐自定义域名
- dayileather.com
- dayihandbags.com
- dayileathergoods.com

## ✅ 部署检查清单

- [ ] 后端 API 部署成功
- [ ] 前端网站部署成功
- [ ] 产品数据正常显示
- [ ] 购物车功能正常
- [ ] 联系表单正常
- [ ] 多语言切换正常
- [ ] 移动端适配正常

## 🔧 环境变量配置

在 Vercel 控制台设置以下环境变量：

### 前端环境变量
```
NEXT_PUBLIC_API_URL=https://dayileather-api.vercel.app
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
```

### 后端环境变量
```
NODE_ENV=production
DATABASE_URL=your_database_url
SMTP_HOST=smtp.gmail.com
SMTP_USER=qw369888@gmail.com
SMTP_PASS=your_email_password
```

## 📊 部署后优化

### SEO 优化
- 提交到 Google Search Console
- 生成 sitemap.xml
- 配置 robots.txt

### 性能优化
- 启用 CDN 加速
- 图片压缩优化
- 代码分割优化

### 监控设置
- 配置 Google Analytics
- 设置错误监控
- 性能监控

## 🚨 注意事项

1. **数据库**：需要配置生产环境数据库
2. **邮件服务**：配置 SMTP 服务发送询盘邮件
3. **支付网关**：配置 Stripe/PayPal 生产环境
4. **域名备案**：如使用中国服务器需要备案

## 📞 技术支持

如遇到部署问题，请检查：
1. Node.js 版本兼容性
2. 环境变量配置
3. API 接口连通性
4. 数据库连接状态

---

**部署完成后，你的独立站将全球可访问！** 🌍