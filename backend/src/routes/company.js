const express = require('express');
const router = express.Router();

// 公司信息
const companyInfo = {
  name: 'Guangzhou Dayi Leather Ltd.',
  nameCN: '广州达益皮具有限公司',
  slogan: 'Manufacturer For Professional Handbags Brands',
  sloganCN: '专业手袋品牌制造商',
  established: '1992',
  experience: '30+',
  
  contact: {
    email: 'salesmanager@sacdepinko.cn',
    phone: '+86-15815808596',
    whatsapp: '+86-15815808596',
    address: 'Guangzhou, China',
  },
  
  factory: {
    area: '5000+',
    countries: '56',
    employees: '200+',
  },
  
  services: [
    {
      id: 'oem',
      title: 'OEM Service',
      titleCN: 'OEM代工服务',
      description: 'Custom manufacturing for your brand',
      descriptionCN: '为您的品牌定制生产',
      icon: 'factory',
    },
    {
      id: 'odm',
      title: 'ODM Service',
      titleCN: 'ODM设计服务',
      description: 'Original design and manufacturing',
      descriptionCN: '原创设计与制造',
      icon: 'design',
    },
    {
      id: 'quality',
      title: 'Quality Control',
      titleCN: '质量控制',
      description: '30+ years of quality assurance',
      descriptionCN: '30年以上质量保证',
      icon: 'quality',
    },
    {
      id: 'shipping',
      title: 'Global Shipping',
      titleCN: '全球配送',
      description: 'Exported to 56 countries',
      descriptionCN: '出口至56个国家',
      icon: 'shipping',
    },
  ],
  
  social: {
    facebook: 'https://facebook.com/sacdepinko',
    instagram: 'https://instagram.com/sacdepinko',
    youtube: 'https://youtube.com/@sacdepinko',
    linkedin: 'https://linkedin.com/company/sacdepinko',
  },
  
  about: {
    title: 'About Sac De Pinko',
    titleCN: '关于达益皮具',
    description: 'As a trusted handbag brand within the industry, Guangzhou Dayi Leather Ltd. is famous for producing high-end shoulder bags, tote bags, crossbody bags, and purses, making them ideal choices for customers seeking style without compromising on quality or longevity.',
    descriptionCN: '作为业内值得信赖的手袋品牌，广州达益皮具有限公司以生产高端单肩包、托特包、斜挎包和钱包而闻名，是追求时尚而不妥协品质和耐用性的客户的理想选择。',
    mission: 'We specialize in designing and manufacturing fashionable bags for handbag brands from Europe, North America, Oceania and more.',
    missionCN: '我们专注于为来自欧洲、北美、大洋洲等地的手袋品牌设计和制造时尚包袋。',
  },
};

// GET /api/company - 获取公司信息
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: companyInfo,
  });
});

// GET /api/company/contact - 获取联系方式
router.get('/contact', (req, res) => {
  res.json({
    success: true,
    data: companyInfo.contact,
  });
});

// GET /api/company/services - 获取服务列表
router.get('/services', (req, res) => {
  res.json({
    success: true,
    data: companyInfo.services,
  });
});

// GET /api/company/about - 获取关于我们
router.get('/about', (req, res) => {
  res.json({
    success: true,
    data: companyInfo.about,
  });
});

module.exports = router;
