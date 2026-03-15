const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/mnt/c/Users/13620/Desktop/新建文件夹 (2)/foreign-trade-platform/database/foreign_trade.db');

// Translation templates for product names
const translations = {
  zh: {
    'Fashion PU Leather': '时尚PU皮革',
    'Shoulder Bag': '单肩包',
    'Crossbody Bag': '斜挎包',
    'Tote Bag': '托特包',
    'Handbag': '手提包',
    'Messenger': '邮差包',
    'Oil Wax': '油蜡',
    'Metal Chain': '金属链条',
    'Custom Logo': '定制LOGO',
    'Large Capacity': '大容量',
    'Drawstring': '抽绳',
    'Luxury': '奢华',
    'Stylish': '时尚',
    'OEM ODM': 'OEM ODM',
    'Wholesale': '批发',
    'Laptop Bag': '笔记本电脑包',
    'Computer': '电脑',
    'Women': '女士',
    'Daily Use': '日常使用',
    'Casual': '休闲'
  },
  ko: {
    'Fashion PU Leather': '패션 PU 가죽',
    'Shoulder Bag': '숄더백',
    'Crossbody Bag': '크로스백',
    'Tote Bag': '토트백',
    'Handbag': '핸드백',
    'Messenger': '메신저백',
    'Oil Wax': '오일 왁스',
    'Metal Chain': '메탈 체인',
    'Custom Logo': '맞춤 로고',
    'Large Capacity': '대용량',
    'Drawstring': '드로스트링',
    'Luxury': '럭셔리',
    'Stylish': '스타일리시',
    'OEM ODM': 'OEM ODM',
    'Wholesale': '도매',
    'Laptop Bag': '노트북 가방',
    'Computer': '컴퓨터',
    'Women': '여성용',
    'Daily Use': '일상용',
    'Casual': '캐주얼'
  },
  es: {
    'Fashion PU Leather': 'Cuero PU de Moda',
    'Shoulder Bag': 'Bolso de Hombro',
    'Crossbody Bag': 'Bolso Cruzado',
    'Tote Bag': 'Bolso Tote',
    'Handbag': 'Bolso de Mano',
    'Messenger': 'Bolso Mensajero',
    'Oil Wax': 'Cera de Aceite',
    'Metal Chain': 'Cadena Metálica',
    'Custom Logo': 'Logo Personalizado',
    'Large Capacity': 'Gran Capacidad',
    'Drawstring': 'Cordón',
    'Luxury': 'Lujo',
    'Stylish': 'Elegante',
    'OEM ODM': 'OEM ODM',
    'Wholesale': 'Mayoreo',
    'Laptop Bag': 'Bolso para Portátil',
    'Computer': 'Computadora',
    'Women': 'Mujer',
    'Daily Use': 'Uso Diario',
    'Casual': 'Casual'
  },
  fr: {
    'Fashion PU Leather': 'Cuir PU Mode',
    'Shoulder Bag': 'Sac à Bandoulière',
    'Crossbody Bag': 'Sac Bandoulière',
    'Tote Bag': 'Sac Cabas',
    'Handbag': 'Sac à Main',
    'Messenger': 'Sac Messager',
    'Oil Wax': 'Cire Huilée',
    'Metal Chain': 'Chaîne Métallique',
    'Custom Logo': 'Logo Personnalisé',
    'Large Capacity': 'Grande Capacité',
    'Drawstring': 'Cordon',
    'Luxury': 'Luxe',
    'Stylish': 'Élégant',
    'OEM ODM': 'OEM ODM',
    'Wholesale': 'Gros',
    'Laptop Bag': 'Sac pour Ordinateur',
    'Computer': 'Ordinateur',
    'Women': 'Femme',
    'Daily Use': 'Usage Quotidien',
    'Casual': 'Décontracté'
  },
  de: {
    'Fashion PU Leather': 'Mode PU-Leder',
    'Shoulder Bag': 'Umhängetasche',
    'Crossbody Bag': 'Crossbody-Tasche',
    'Tote Bag': 'Tragetasche',
    'Handbag': 'Handtasche',
    'Messenger': 'Messenger-Tasche',
    'Oil Wax': 'Ölwachs',
    'Metal Chain': 'Metallkette',
    'Custom Logo': 'Individuelles Logo',
    'Large Capacity': 'Große Kapazität',
    'Drawstring': 'Kordelzug',
    'Luxury': 'Luxus',
    'Stylish': 'Stilvoll',
    'OEM ODM': 'OEM ODM',
    'Wholesale': 'Großhandel',
    'Laptop Bag': 'Laptoptasche',
    'Computer': 'Computer',
    'Women': 'Damen',
    'Daily Use': 'Täglicher Gebrauch',
    'Casual': 'Lässig'
  },
  it: {
    'Fashion PU Leather': 'Pelle PU Moda',
    'Shoulder Bag': 'Borsa a Spalla',
    'Crossbody Bag': 'Borsa a Tracolla',
    'Tote Bag': 'Borsa Tote',
    'Handbag': 'Borsa',
    'Messenger': 'Borsa Messenger',
    'Oil Wax': 'Cera Oleosa',
    'Metal Chain': 'Catena Metallica',
    'Custom Logo': 'Logo Personalizzato',
    'Large Capacity': 'Grande Capacità',
    'Drawstring': 'Coulisse',
    'Luxury': 'Lusso',
    'Stylish': 'Elegante',
    'OEM ODM': 'OEM ODM',
    'Wholesale': 'All\'ingrosso',
    'Laptop Bag': 'Borsa per Laptop',
    'Computer': 'Computer',
    'Women': 'Donna',
    'Daily Use': 'Uso Quotidiano',
    'Casual': 'Casual'
  },
  pt: {
    'Fashion PU Leather': 'Couro PU Moda',
    'Shoulder Bag': 'Bolsa de Ombro',
    'Crossbody Bag': 'Bolsa Transversal',
    'Tote Bag': 'Bolsa Tote',
    'Handbag': 'Bolsa de Mão',
    'Messenger': 'Bolsa Mensageiro',
    'Oil Wax': 'Cera de Óleo',
    'Metal Chain': 'Corrente Metálica',
    'Custom Logo': 'Logo Personalizado',
    'Large Capacity': 'Grande Capacidade',
    'Drawstring': 'Cordão',
    'Luxury': 'Luxo',
    'Stylish': 'Elegante',
    'OEM ODM': 'OEM ODM',
    'Wholesale': 'Atacado',
    'Laptop Bag': 'Bolsa para Laptop',
    'Computer': 'Computador',
    'Women': 'Mulher',
    'Daily Use': 'Uso Diário',
    'Casual': 'Casual'
  },
  ru: {
    'Fashion PU Leather': 'Модная PU Кожа',
    'Shoulder Bag': 'Сумка через Плечо',
    'Crossbody Bag': 'Кроссбоди Сумка',
    'Tote Bag': 'Сумка Тоут',
    'Handbag': 'Сумка',
    'Messenger': 'Сумка Мессенджер',
    'Oil Wax': 'Масляный Воск',
    'Metal Chain': 'Металлическая Цепь',
    'Custom Logo': 'Индивидуальный Логотип',
    'Large Capacity': 'Большая Вместимость',
    'Drawstring': 'Шнурок',
    'Luxury': 'Роскошь',
    'Stylish': 'Стильный',
    'OEM ODM': 'OEM ODM',
    'Wholesale': 'Оптом',
    'Laptop Bag': 'Сумка для Ноутбука',
    'Computer': 'Компьютер',
    'Women': 'Женская',
    'Daily Use': 'Повседневное Использование',
    'Casual': 'Повседневный'
  },
  ja: {
    'Fashion PU Leather': 'ファッションPUレザー',
    'Shoulder Bag': 'ショルダーバッグ',
    'Crossbody Bag': 'クロスボディバッグ',
    'Tote Bag': 'トートバッグ',
    'Handbag': 'ハンドバッグ',
    'Messenger': 'メッセンジャーバッグ',
    'Oil Wax': 'オイルワックス',
    'Metal Chain': 'メタルチェーン',
    'Custom Logo': 'カスタムロゴ',
    'Large Capacity': '大容量',
    'Drawstring': '巾着',
    'Luxury': 'ラグジュアリー',
    'Stylish': 'スタイリッシュ',
    'OEM ODM': 'OEM ODM',
    'Wholesale': '卸売',
    'Laptop Bag': 'ノートパソコンバッグ',
    'Computer': 'コンピューター',
    'Women': '女性用',
    'Daily Use': '日常使用',
    'Casual': 'カジュアル'
  },
  ar: {
    'Fashion PU Leather': 'جلد PU عصري',
    'Shoulder Bag': 'حقيبة كتف',
    'Crossbody Bag': 'حقيبة كروس بودي',
    'Tote Bag': 'حقيبة توت',
    'Handbag': 'حقيبة يد',
    'Messenger': 'حقيبة رسول',
    'Oil Wax': 'شمع زيتي',
    'Metal Chain': 'سلسلة معدنية',
    'Custom Logo': 'شعار مخصص',
    'Large Capacity': 'سعة كبيرة',
    'Drawstring': 'حبل سحب',
    'Luxury': 'فاخر',
    'Stylish': 'أنيق',
    'OEM ODM': 'OEM ODM',
    'Wholesale': 'جملة',
    'Laptop Bag': 'حقيبة لابتوب',
    'Computer': 'كمبيوتر',
    'Women': 'نسائي',
    'Daily Use': 'استخدام يومي',
    'Casual': 'كاجوال'
  },
  tr: {
    'Fashion PU Leather': 'Moda PU Deri',
    'Shoulder Bag': 'Omuz Çantası',
    'Crossbody Bag': 'Çapraz Çanta',
    'Tote Bag': 'Tote Çanta',
    'Handbag': 'El Çantası',
    'Messenger': 'Messenger Çanta',
    'Oil Wax': 'Yağ Mumu',
    'Metal Chain': 'Metal Zincir',
    'Custom Logo': 'Özel Logo',
    'Large Capacity': 'Büyük Kapasite',
    'Drawstring': 'Büzgülü',
    'Luxury': 'Lüks',
    'Stylish': 'Şık',
    'OEM ODM': 'OEM ODM',
    'Wholesale': 'Toptan',
    'Laptop Bag': 'Laptop Çantası',
    'Computer': 'Bilgisayar',
    'Women': 'Kadın',
    'Daily Use': 'Günlük Kullanım',
    'Casual': 'Günlük'
  }
};

function translateText(text, lang) {
  let translated = text;
  const dict = translations[lang];
  
  // Replace each term
  for (const [en, trans] of Object.entries(dict)) {
    translated = translated.replace(new RegExp(en, 'gi'), trans);
  }
  
  // Remove year prefix for cleaner look
  translated = translated.replace(/^2026\s+/i, '');
  
  return translated;
}

db.all('SELECT id, name, description FROM products', (err, products) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  
  console.log(`Found ${products.length} products to translate`);
  
  let completed = 0;
  
  products.forEach(product => {
    const updates = {};
    
    // Generate translations for each language
    Object.keys(translations).forEach(lang => {
      updates[`name_${lang}`] = translateText(product.name, lang);
      updates[`description_${lang}`] = translateText(product.description, lang);
    });
    
    // Build UPDATE query
    const setClauses = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(product.id);
    
    db.run(
      `UPDATE products SET ${setClauses} WHERE id = ?`,
      values,
      (err) => {
        if (err) {
          console.error(`Error updating product ${product.id}:`, err);
        } else {
          completed++;
          if (completed % 5 === 0) {
            console.log(`✅ Translated ${completed}/${products.length} products`);
          }
        }
        
        if (completed === products.length) {
          console.log(`\n🎉 All ${products.length} products translated!`);
          db.close();
        }
      }
    );
  });
});
