const mongoose = require('mongoose');
require('dotenv').config();

const baseUrl = process.env.IMAGE_BASE_URL;
const Item = require('../models/Item');



const items = [
    {
      name: "Uzun Kılıç",
      type: "sword",
      key: "uzun-kilic",
      levels: [
        { level: 1, name: "Gümüş Diş", description: "Sade, keskin bir savaş kılıcı.", image: `${baseUrl}/CardItem/LongSword/1.png` },
        { level: 2, name: "Zümrüt Yürek", description: "Can alıcı darbeler için güçlendirildi.", image: `${baseUrl}/CardItem/LongSword/2.png` },
        { level: 3, name: "Altın Pençe", description: "Kralların kanını döken efsanevi keskinlik.", image: `${baseUrl}/CardItem/LongSword/3.png` }
      ]
    },
    {
        name: "Savaş Baltası",
        type: "axe",
        key: "savas-baltasi",
        levels: [
            { level: 1, name: "Ay Parçası", description: "Hafif ve hızlı bir balta.", image: `${baseUrl}/CardItem/WarAxe/1.png` },
            { level: 2, name: "Zümrüt Kesik", description: "Derin yaralar açan büyülü çelik.", image: `${baseUrl}/CardItem/WarAxe/2.png` },
            { level: 3, name: "Efsane Yarma", description: "Tek vuruşta kale kapısı deler.", image: `${baseUrl}/CardItem/WarAxe/3.png` }
        ]
    },
    {
        name: "Büyü Asası",
        type: "stave",
        key: "büyü-asasi",
        levels: [
            { level: 1, name: "Gölge Dalı", description: "Temel büyü asası.", image: `${baseUrl}/CardItem/Staff/1.png` },
            { level: 2, name: "Zümrüt Kök", description: "Doğanın gücüyle titreşir.", image: `${baseUrl}/CardItem/Staff/2.png` },
            { level: 3, name: "Altın Kök", description: "Yıldızları yere indirir, zamanı büker.", image: `${baseUrl}/CardItem/Staff/3.png` }
        ]
    },
    {
        name: "Kalkan",
        type: "shield",
        key: "kalkan",
        levels: [
            { level: 1, name: "Gümüş Siperi", description: "Basit bir koruma aracı.", image: `${baseUrl}/CardItem/Shield/1.png` },
            { level: 2, name: "Zümrüt Zırh", description: "Gelen saldırıyı yansıtır.", image: `${baseUrl}/CardItem/Shield/2.png` },
            { level: 3, name: "Altın Duvar", description: "Tanrılar bile geçemez.", image: `${baseUrl}/CardItem/Shield/3.png` }
        ]
    },
    {
        name: "Savaş Çekici",
        type: "hammer",
        key: "savas-cekici",
        levels: [
            { level: 1, name: "Taş Parçalayıcı", description: "Ağır ve yıkıcı.", image: `${baseUrl}/CardItem/WarMaul/1.png` },
            { level: 2, name: "Zümrüt Ezici", description: "Zırhları paramparça eder.", image: `${baseUrl}/CardItem/WarMaul/2.png` },
            { level: 3, name: "Altın Hüküm", description: "Dünyayı çatlatır, düşmanları ezer.", image: `${baseUrl}/CardItem/WarMaul/3.png` }
        ]
    },
    {
        name: "Eğri Kılıç",
        type: "scimitar",
        key: "egri-kilic",
        levels: [
            { level: 1, name: "Gümüş Pençe", description: "Hafif ve çevik bir bıçak.", image: `${baseUrl}/CardItem/Scimitar/1.png` },
            { level: 2, name: "Zümrüt Çengel", description: "Derin kesikler için eğildi.", image: `${baseUrl}/CardItem/Scimitar/2.png` },
            { level: 3, name: "Altın Yılan", description: "Gölge gibi kayar, kaderi biçer.", image: `${baseUrl}/CardItem/Scimitar/3.png` }
        ]
    },
    {
        name: "Kısa Kılıç",
        type: "dagger", 
        key: "kisa-kilic",
        levels: [
            { level: 1, name: "Gölge Kesik", description: "Hızlı saldırılar için ideal.", image: `${baseUrl}/CardItem/Dagger/1.png` },
            { level: 2, name: "Zümrüt Fısıltı", description: "Sessiz ama ölümcül.", image: `${baseUrl}/CardItem/Dagger/2.png` },
            { level: 3, name: "Altın Dilim", description: "Zamanda bile iz bırakır.", image: `${baseUrl}/CardItem/Dagger/3.png` }
        ]
    },
    {
        name: "Büyü Kitabı",
        type: "tome",
        key: "büyü-kitabi", 
        levels: [
            { level: 1, name: "Gümüş Sayfalar", description: "Temel büyüleri içerir.", image: `${baseUrl}/CardItem/Tome/1.png` },
            { level: 2, name: "Zümrüt Kehanet", description: "Geleceği okur, kaderi değiştirir.", image: `${baseUrl}/CardItem/Tome/2.png` },
            { level: 3, name: "Altın Kitabe", description: "Evrenin sırlarını fısıldar, gerçekliği ezer.", image: `${baseUrl}/CardItem/Tome/3.png` }
        ]
    }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Item.deleteMany({});
  await Item.insertMany(items);
  console.log('Items seeded!');



}

module.exports = seed;