const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/mnt/c/Users/13620/Desktop/新建文件夹 (2)/foreign-trade-platform/database/foreign_trade.db');

// 为每个产品手动创建简洁的韩语标题
const productTranslations = {
  529: {
    ko: "2026 패션 PU 가죽 오일 왁스 숄더백 메탈 체인 크로스백",
    zh: "2026 时尚PU皮革油蜡单肩包金属链条斜挎包"
  },
  530: {
    ko: "2026 도매 PU 가죽 토트백 맞춤 로고 대용량 드로스트링",
    zh: "2026 批发PU皮革托特包定制LOGO大容量抽绳"
  },
  531: {
    ko: "OEM ODM 패셔너블 대형 숄더백 럭셔리 여성 토트백",
    zh: "OEM ODM 时尚大型单肩包奢华女士托特包"
  },
  532: {
    ko: "여성용 맞춤 노트북 가방 PU 가죽 대용량 오피스 핸드백",
    zh: "女士定制笔记本电脑包PU皮革大容量办公手提包"
  },
  533: {
    ko: "2026 OEM ODM 프리미엄 여성 핸드백 대용량 숄더백 토트백",
    zh: "2026 OEM ODM 高级女士手提包大容量单肩包托特包"
  },
  534: {
    ko: "2026 신상품 한국 여성 토트백 심플 대용량 PU 가죽 숄더백",
    zh: "2026 新品韩国女士托特包简约大容量PU皮革单肩包"
  },
  535: {
    ko: "2026 패션 PU 가죽 여성 핸드백 대용량 숄더백 토트백",
    zh: "2026 时尚PU皮革女士手提包大容量单肩包托特包"
  },
  536: {
    ko: "2026 여성 PU 가죽 핸드백 대용량 숄더백 캐주얼 토트백",
    zh: "2026 女士PU皮革手提包大容量单肩包休闲托特包"
  },
  537: {
    ko: "2026 패션 여성 PU 가죽 핸드백 대용량 숄더백 토트백",
    zh: "2026 时尚女士PU皮革手提包大容量单肩包托特包"
  },
  538: {
    ko: "2026 여성 PU 가죽 토트백 대용량 숄더백 캐주얼 핸드백",
    zh: "2026 女士PU皮革托特包大容量单肩包休闲手提包"
  },
  539: {
    ko: "2026 패션 여성 핸드백 PU 가죽 대용량 숄더백 토트백",
    zh: "2026 时尚女士手提包PU皮革大容量单肩包托特包"
  },
  540: {
    ko: "2026 여성 PU 가죽 핸드백 대용량 토트백 숄더백",
    zh: "2026 女士PU皮革手提包大容量托特包单肩包"
  },
  541: {
    ko: "2026 패션 PU 가죽 여성 토트백 대용량 숄더백 핸드백",
    zh: "2026 时尚PU皮革女士托特包大容量单肩包手提包"
  },
  542: {
    ko: "2026 여성 PU 가죽 숄더백 대용량 토트백 캐주얼 핸드백",
    zh: "2026 女士PU皮革单肩包大容量托特包休闲手提包"
  },
  543: {
    ko: "2026 패션 여성 PU 가죽 토트백 대용량 숄더백",
    zh: "2026 时尚女士PU皮革托特包大容量单肩包"
  },
  544: {
    ko: "2026 여성 PU 가죽 핸드백 대용량 캐주얼 숄더백 토트백",
    zh: "2026 女士PU皮革手提包大容量休闲单肩包托特包"
  },
  545: {
    ko: "2026 패션 PU 가죽 여성 핸드백 대용량 숄더백",
    zh: "2026 时尚PU皮革女士手提包大容量单肩包"
  },
  546: {
    ko: "2026 여성 PU 가죽 토트백 대용량 숄더백 핸드백",
    zh: "2026 女士PU皮革托特包大容量单肩包手提包"
  }
};

let completed = 0;
const total = Object.keys(productTranslations).length;

for (const [id, trans] of Object.entries(productTranslations)) {
  db.run(
    'UPDATE products SET name_ko = ?, name_zh = ? WHERE id = ?',
    [trans.ko, trans.zh, id],
    (err) => {
      if (err) {
        console.error(`❌ Error updating product ${id}:`, err.message);
      } else {
        completed++;
        console.log(`✅ Updated product ${id}: ${trans.ko}`);
      }
      
      if (completed === total) {
        console.log(`\n🎉 Updated ${total} products with clean translations!`);
        db.close();
      }
    }
  );
}
