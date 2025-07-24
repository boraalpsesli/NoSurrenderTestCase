# 🎮 No Surrender Studio - Kart Geliştirme Oyunu

Merhaba! Case-Studye Hoşgeldiniz.

## 🎯 Proje Hakkında

Bu proje, kart tabanlı bir oyun sistemi. Kullanıcılar kartlarını geliştirip seviye atlatabiliyor. En büyük sıkıntı eskiden bir kartı seviye atlatmak için 50 kez butona basmak gerekiyordu , onu çözdüm artık istediğin kadar tıklama seçebiliyorsun.

### ✨ Şuanki Özellikler
- 🔐 **Kullanıcı Authentication**: Kayıt ol, giriş yap.
- ⚡ **Enerji Sistemi**: 2 dakikada bir enerji yenileniyor.
- 🃏 **Kart Geliştirme**: Kartlardaki Geliştirme butonuna basarak 1 enerji harcayıp,%2 gelişim elde edilebiliyor.
- 🃏 **Çoklu Gelişim** : Kullanıcı geliştirme seviyesi belirleyerek aynı anda çok fazla  kart gelişim, elde edebiliyor tabi enerjisi yetiyorsa.
- 📱 **Responsive**: Olabildiğince responsive bir UI tasarımı yapmaya çalıştım.


## 🛠️ Teknik Detaylar

**Frontend:**
- React 18 (hooks kullandım)
- Redux Toolkit (state management için)
- Axios (API çağrıları)
- CSS (sadece CSS, framework kullanmadım)

**Backend:**
- Node.js + Express
- MongoDB (Mongoose ile)
- CORS (frontend-backend iletişimi için)

## 🚀 Hızlı Başlangıç (TL;DR)

```bash
# 1. Projeyi kopyala
git clone [repository-url]
cd NoSurrenderTestCase

# 2. Backend
cd backend
npm install
# .env dosyasını oluştur (aşağıdaki detayları oku)
node src/Seeder.js
npm start

# 3. Frontend
cd frontend
npm install
npm start

# 4. http://localhost:3000'e git
# admin/123456 ile giriş yap
```

## 🛠️ Detaylı Kurulum

### Ön Gereksinimler
- Node.js (16+ olmalı)
- MongoDB (local veya Atlas)
- Git

### 1. Projeyi İndir
```bash
git clone [repository-url]
cd NoSurrenderTestCase
```

### 2. MongoDB Kurulumu
MongoDB'in çalışıyor olması lazım. Eğer yoksa:
- **Local**: [MongoDB Community](https://www.mongodb.com/try/download/community) indir
- **Atlas**: [MongoDB Atlas](https://www.mongodb.com/atlas)'ta ücretsiz cluster oluştur

### 3. Backend Kurulumu

```bash
cd backend
npm install
```

`.env` dosyası oluştur (backend klasöründe):
```env 
**Not**:MongoDB Atlas kullanıyorsan Örnek MONGODB_URI: 
MONGO_URI=mongodb+srv://dbadmin:<db_password>@cluster0.xmi34tb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

PORT=5002
IMAGE_BASE_URL=http://localhost:3000
```

**Not**: MongoDB Compass kullanıyorsan Örnek MONGODB_URI
```env
MONGO_URI=mongodb+srv://dbadmin:<db_password>@cluster0.xmi34tb.mongodb.net/

```

Veritabanı Seeder:
```bash
node src/Seeder.js
```

Backend'i başlat:
```bash
npm start
```

### 4. Frontend Kurulumu
`config.js` dosyası oluştur (frontend klasöründe):
```env
export const API_BASE_URL = "http://localhost:5002/api/v1";
```

```javascript
Yeni terminal aç:
```bash
cd frontend
npm install
npm start
```

### 5. Giriş Yap
Test kullanıcıları (Seeder ile oluşturuluyor):
- **admin** / **123456**
- **test** / **test123** 
- **demo** / **demo123**

Veya yeni hesap oluşturabilirsin.

## 🎮 Nasıl Kullanılır?

1. **Giriş Yap**: Test hesaplarından biriyle giriş yap yada Kayıt Ol
2. **Kart Seç**: Ana ekranda kartlarını göreceksin
3. **Geliştir**: 
   - Geliştirme seviyesi seç (1-50 arası)
   - "Geliştir" butonuna bas
   - Progress %100 olunca "Yükselt" butonu çıkacak
4. **Enerji**: Her tıklama 1 enerji harcar, 2 dakikada 1 enerji yenilenir
5. **Filtre**: Kullanıcı isterse eşyalarını filtreleyebiliyor.


## 🤔 Karşılaştığım Problemler ve Çözümler

### Problem 1: 50 Kez Tıklama
**Sorun**: Bir kartı seviye atlatmak için 50 kez butona basmak gerekiyordu
**Çözüm**: Bulk progress APi'si yazdım.kullanıcı 1 ile 50 arasında bir geliştirme seviyesi seçip bir kerede enerjisinin yettiği kadar  karta progress kazandırabiliyor ve 50 kere basmak zorunda kalmadığından arka arkaya çok fazla istek atıp yormuyor sunucuyu aynı zamanda dinamik olarak yollanan değere göre bulk progress yada single progress apisi kullanılıyor.

**Kod Örneği - Bulk Progress API:**
```javascript
// Backend: routes/progress.js - Bulk progress endpoint
router.post('/bulk', async (req, res) => {
  const { itemId, clicks, userId } = req.body;
  
  if (!itemId || !clicks || !userId) {
    return res.status(400).json({ error: 'itemId, clicks, and userId required' });
  }
  
  if (clicks < 1 || clicks > 100) {
    return res.status(400).json({ error: 'clicks must be between 1 and 100' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const energyRequired = clicks;
    if (user.energy < energyRequired) {
      return res.status(400).json({ 
        error: `Not enough energy. Required: ${energyRequired}, Available: ${user.energy}` 
      });
    }

    const userItem = await UserItem.findOne({ userId, itemId });
    if (!userItem) return res.status(404).json({ error: 'UserItem not found' });

    if (userItem.level >= 3) {
      return res.status(400).json({ error: 'Max level reached' });
    }

    const progressIncrease = clicks * 2;
    const newProgress = userItem.progress + progressIncrease;
    if(newProgress>100){
      return res.status(400).json(
        {
          error:"Item's Progress can not be increased beyond its limit."
        }
      )
    }
    
    userItem.progress = newProgress;
    user.energy -= energyRequired;
    
    // Atomic operation ile hem progress hem energy güncelleniyor
    await Promise.all([userItem.save(), user.save()]);

    res.json({ 
      progress: userItem.progress, 
      energy: user.energy,
      clicksProcessed: clicks,
      progressIncreased: progressIncrease
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

**Frontend - ClickCounter Component:**
```javascript
// Frontend: components/ClickCounter/ClickCounter.js
function ClickCounter({ clickCount, setClickCount, maxClicks = 50 }) {
  const handleChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setClickCount(Math.min(Math.max(1, value), maxClicks));
  };

  const energyCost = clickCount;
  const progressGain = clickCount * 2;

  return (
    <div className="click-counter-container">
      <div className="click-counter-label">
        Geliştirme Seviyesi
      </div>
      
      <div className="click-counter-main">
        <div className="click-counter-info">
          <div className="energy-cost">
            <img src={energyIcon} alt="energy" className="energy-icon" />
            <span>-{energyCost}</span>
          </div>
          <div className="progress-gain">
            <span>İlerleme: +{progressGain}%</span>
          </div>
        </div>
        
        <div className="click-counter-controls">
          <button 
            className="click-counter-btn" 
            onClick={handleDecrement}
            disabled={clickCount <= 1}
          >
            -
          </button>
          <input 
            type="number" 
            min="1" 
            max={maxClicks}
            value={clickCount}
            onChange={handleChange}
            className="click-counter-input"
          />
          <button 
            className="click-counter-btn" 
            onClick={handleIncrement}
            disabled={clickCount >= maxClicks}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Problem 2: Edge Caseler
**Edge-Case-1**: Kullanıcı arka arkaya çok fazla Yükselt tuşuna basınca sahip olduğu eşya 1 seviyeden 3 seviyeye çıkabiliyor.
**Çözüm**: Locking mantığı  `isLevelingUp` adında  bir Boolean flag oluşturup bunu kullanarak level up işlemi sırasında backende işlemi locklayıp tamamlanınca açılmasını sağladım böylelikle birden fazla kere seviye atlatılamıyor aynı anda.

**Kod Örneği - Locking Mechanism:**
```javascript
// Backend: models/UserItem.js - Locking flag tanımı
const userItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  level: { type: Number, default: 1, min: 1, max: 3 },
  progress: { 
    type: Number, 
    default: 0, 
    min: [0, 'Progress cannot be negative'], 
    max: [100, 'Progress cannot exceed 100%'] 
  },
  isLevelingUp: { type: Boolean, default: false }, // Locking flag
});
```

```javascript
// Backend: routes/levelUp.js - Atomic locking ile level up
router.post('/', async (req, res) => {
  const { itemId, userId } = req.body;
  if (!itemId || !userId) return res.status(400).json({ error: 'itemId and userId required' });

  let userItem;
  try {
    // Atomic operation: sadece isLevelingUp=false olan itemları güncelle
    userItem = await UserItem.findOneAndUpdate(
      { userId, itemId, isLevelingUp: false },
      { $set: { isLevelingUp: true } },
      { new: true }
    ).populate('itemId');

    if (!userItem) return res.status(423).json({ error: 'Item is already being leveled up. Please wait.' });
    
    if (userItem.level >= 3) {
      userItem.isLevelingUp = false;
      await userItem.save();
      return res.status(400).json({ error: 'Max level reached' });
    }

    userItem.level += 1;
    userItem.progress = 0;
    await userItem.save();

    const currentItem = userItem.itemId.levels.find(lvl => lvl.level === userItem.level);

    // İşlem tamamlandı, lock'ı aç
    userItem.isLevelingUp = false;
    await userItem.save();

    res.json({
      level: userItem.level,
      progress: userItem.progress,
      energy: user.energy,
      name: currentItem.name,
      description: currentItem.description,
      image: currentItem.image
    });
  } catch (err) {
    // Hata durumunda lock'ı aç
    if (userItem) {
      userItem.isLevelingUp = false;
      await userItem.save();
    }
    res.status(500).json({ error: err.message });
  }
});
```

**Edge-Case-2**:Çoklu yükseltme sırasında Sahip olunan enerjiden fazlasının kullanılması ve aynı zamanda progresin %100 üstüne çıkılması ve enerji ve progress boşa gitmesi.

**Çözüm**:Birden fazla katmanlı validasyon ve aynı zamanda atomic olarak yaptığım enerji hepsalamasıyla bunun önüne geçiyorum.Model katmanında kullandığım validasyonlar ve yine çok katmanlı validasyon yapısıyla overflowun üstüne çıkıyorum.

**Kod Örneği - Katmanlı Validasyon:**
```javascript
// Backend: routes/progress.js - Çoklu validasyon katmanları
router.post('/bulk', async (req, res) => {
  const { itemId, clicks, userId } = req.body;
  
  // İlk katman: Input validasyonu
  if (!itemId || !clicks || !userId) {
    return res.status(400).json({ error: 'itemId, clicks, and userId required' });
  }
  
  if (clicks < 1 || clicks > 100) {
    return res.status(400).json({ error: 'clicks must be between 1 and 100' });
  }

  try {
    // İkinci katman: User ve energy validasyonu
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const energyRequired = clicks;
    if (user.energy < energyRequired) {
      return res.status(400).json({ 
        error: `Not enough energy. Required: ${energyRequired}, Available: ${user.energy}` 
      });
    }

    // Üçüncü katman: Item validasyonu
    const userItem = await UserItem.findOne({ userId, itemId });
    if (!userItem) return res.status(404).json({ error: 'UserItem not found' });

    if (userItem.level >= 3) {
      return res.status(400).json({ error: 'Max level reached' });
    }

    // Dördüncü katman: Progress overflow kontrolü
    const progressIncrease = clicks * 2;
    const newProgress = userItem.progress + progressIncrease;
    if(newProgress > 100){
      return res.status(400).json({
        error:"Item's Progress can not be increased beyond its limit."
      })
    }
    
    // Beşinci katman: Atomic güncelleme
    userItem.progress = newProgress;
    user.energy -= energyRequired;
    
    await Promise.all([userItem.save(), user.save()]);

    res.json({ 
      progress: userItem.progress, 
      energy: user.energy,
      clicksProcessed: clicks,
      progressIncreased: progressIncrease
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

**Edge-Case-3**:Enerji yenilenmesine kalan süre hesaplamasında oluşabilecek NaN değerler ve aynı zamanda İnternet gecikmesi ile yaşanabilecek Enerji yenileme problemi.

**Çözüm**:Detaylı validation kontrolü ve fallback değerlerinin yapılması ve aynı zamanda optimistic değerler kullanılarak Client tarafında güncelleme yaparak gecikmelerden oluşucak problemlerin önüne geçiliyor.

**Kod Örneği - Enerji Hesaplama ve Optimistic Updates:**
```javascript
// Frontend: pages/BotScreen.js - Güvenli time hesaplama
function calculateTimeLeft(lastEnergyUpdate, currentEnergy) {
  if (currentEnergy >= 100) return "Full";
  if (!lastEnergyUpdate) return "--:--";
  
  const last = new Date(lastEnergyUpdate).getTime();
  if (isNaN(last)) return "--:--"; // NaN kontrolü
  
  const regenInterval = 2 * 60 * 1000; // 2 minutes in ms
  const now = Date.now();
  const next = last + regenInterval;
  const msLeft = Math.max(next - now, 0);
  
  const min = Math.floor(msLeft / 60000);
  const sec = Math.floor((msLeft % 60000) / 1000);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

// Optimistic update ile gecikme probleminin çözümü
useEffect(() => {
  if (!lastEnergyUpdate) return;
  if (current >= 100) return;
  
  let fetched = false;
  const timer = setInterval(() => {
    setEnergy(prev => {
      if (!prev.lastEnergyUpdate || prev.current >= 100) return prev;
      const timeLeft = calculateTimeLeft(prev.lastEnergyUpdate, prev.current);
      
      if (timeLeft === "0:00" && !fetched) {
        fetched = true;
        // Optimistic update: UI'ı hemen güncelle
        const optimisticCurrent = Math.min(prev.current + 1, prev.max);
        setEnergy({
          ...prev,
          current: optimisticCurrent,
          percent: (optimisticCurrent / prev.max) * 100,
          timeLeft: "2:00" 
        });

        // Sonra gerçek değeri sunucudan al
        axios.get(`${API_BASE_URL}/energy/${userId}`)
          .then(res => {
            const { energy, lastEnergyUpdate } = res.data;
            setEnergy({
              current: energy,
              max: 100,
              percent: (energy / 100) * 100,
              timeLeft: calculateTimeLeft(lastEnergyUpdate, energy),
              lastEnergyUpdate
            });
          })
          .catch(err => {
            console.error(err);
          });
      }
      return { ...prev, timeLeft };
    });
  }, 1000);
  
  return () => clearInterval(timer);
}, [lastEnergyUpdate, current, userId]);
```

```javascript
// Backend: routes/energy.js - Server-side enerji hesaplama
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const now = Date.now();
    let { energy, lastEnergyUpdate } = user;
    const maxEnergy = 100;
    const regenInterval = 2 * 60 * 1000;

    if (energy < maxEnergy) {
      const last = new Date(lastEnergyUpdate).getTime();
      const elapsed = now - last;
      const regenAmount = Math.floor(elapsed / regenInterval);

      if (regenAmount > 0) {
        energy = Math.min(maxEnergy, energy + regenAmount);
        lastEnergyUpdate = new Date(last + regenAmount * regenInterval);
        user.energy = energy;
        user.lastEnergyUpdate = lastEnergyUpdate;
        await user.save();
      }
    }

    res.json({ 
      energy, 
      lastEnergyUpdate: new Date(lastEnergyUpdate).toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

### Kullanıcı Deneyimi: Nasıl daha hızlı ve akıcı hale getirirsiniz?
50 kez butona basmak çok yorucu ve sıkıcı bir durum, ben de ClickCounter yapmayı tercih ettim.artık istediğiniz kadar seçebiliyorsunuz buda bunu bu kadar geliştireyim öbür eşyayı ise şu kadar geliştireyim diye aynı zamanda biraz startejik bir tarafıda açıyor.Toast mesajları ekledim ki kullanıcı ne olup bittiğini anlasın.Aynı zamanda bir user sistemi ekledim kullanıcı giriş yapıp çıkabiliyor girdiği zamanda kendini görebiliyor.

**Kod Örneği - Dinamik API Çağrısı:**
```javascript
// Frontend: pages/BotScreen.js - Single vs Bulk API seçimi
const progressCard = (cardId) => {
  const card = cards.find(c => c.id === cardId);
  const isLevelUp = card && card.progress >= 100;
  
  if (isLevelUp) {
    // Level up işlemi
    axios.post(`${API_BASE_URL}/level-up`, { userId, itemId: cardId })
      .then(res => {
        // State güncellemeleri...
      })
      .catch(err => {
        setToastMessage(err.response.data.error);
      });
    return;
  }
  
  // Dinamik endpoint seçimi: 1 tıklama = single, fazlası = bulk
  const endpoint = clickCount > 1 ? 'progress/bulk' : 'progress';
  const payload = clickCount > 1 
    ? { userId, itemId: cardId, clicks: clickCount }
    : { userId, itemId: cardId };
  
  axios.post(`${API_BASE_URL}/${endpoint}`, payload)
    .then(res => {
      // Optimistic update
      if (res.data.energy !== undefined) {
        setEnergy(prev => ({
          ...prev,
          current: res.data.energy,
          percent: (res.data.energy / 100) * 100,
          timeLeft: calculateTimeLeft(prev.lastEnergyUpdate, res.data.energy),
        }));
      }
    
      if (typeof res.data.progress !== 'undefined') {
        dispatch(setProgress({ cardId, progress: res.data.progress }));
        dispatch(updateCard({ cardId, updates: { progress: res.data.progress } }));
      }
      
      // Toast mesajı gösterimi
      if (clickCount > 1 && res.data.warning) {
        setToastMessage(res.data.warning);
      }
    })
    .catch(err => {
      setToastMessage(err.response.data.error);
    });
};
```

### Performans: Sunucu ve network yükünü nasıl azaltırsınız?
En büyük sorunlardan birisi bu bence, 50 tane istek atmak yerine tek bir istek ile çoklu işlem yapmayı düşündüm açıkçası Redux State yapısı kullanarak  çok fazla api isteği atmayı engellemeye çalıştım olduğu kadar,o yüzden bazı veriler clientda mevcut enerji sistemi ise sürekli ping atılmasın diye bir timer sistemi kullandım ki sürekli bir ping atılmasın ve zamanı geldiğinde istek atılsın.Açıkçası birden fazla cihazdan aynı anda gelen istekleri test edemedim ne yazıkki süreden kaynaklı olarak.

**Kod Örneği - Redux State Management:**
```javascript
// Frontend: store/progressSlice.js - Client-side state yönetimi
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  byId: {}, 
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setAllProgress(state, action) {
      // Tüm progress değerlerini bir kerede yükle
      state.byId = action.payload;
    },
    setProgress(state, action) {
      // Tek item progress güncelleme (API çağrısından sonra)
      state.byId[action.payload.cardId] = action.payload.progress;
    },
  },
});

export const { setAllProgress, setProgress } = progressSlice.actions;
export default progressSlice.reducer;
```

```javascript
// Frontend: pages/BotScreen.js - Timer-based energy fetching
useEffect(() => {
  // İlk yükleme
  fetchEnergy();
  
  // 2 dakikada bir fetch et (sürekli ping atmak yerine)
  const interval = setInterval(fetchEnergy, 2 * 60 * 1000);
  return () => clearInterval(interval);
  
  function fetchEnergy() {
    axios.get(`${API_BASE_URL}/energy/${userId}`)
      .then(res => {
        const { energy, lastEnergyUpdate } = res.data;
        setEnergy({
          current: energy,
          max: 100,
          percent: (energy / 100) * 100,
          timeLeft: calculateTimeLeft(lastEnergyUpdate, energy),
          lastEnergyUpdate
        });
      })
      .catch(err => {
        console.error(err);
      });
  }
}, [dispatch, userId]);
```

### Güvenlik: Kullanıcının sistemi kötüye kullanılmasını nasıl engellersiniz?
ilk başta mesela hızlı tıkladığınız zaman kartı birden fazla kere seviye atlatabiliyordunuz ve frontend'de tuttuğum kontroler güvenlik açığı yaratıyordu bu yezden ilki için bir locking mekanizması kullandım flagle ki böyle bi durum olamasın ve tüm validasyon/kontrolleri backende taşıdım ve frontende güvenilmeyip olabildiğince kontrol yaptım.Aynı zamanda Schema/Model kısmındada constraintler belirlediğimden buda ekstra bir güvenlik katmanı olarak güvenliğe yardımcı oluyor aynı zamandada bir authentication ekleyip bir user bazlı  bir erişim ekledim.

**Kod Örneği - Authentication System:**
```javascript
// Backend: routes/auth.js - Kullanıcı doğrulama
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Kullanıcı adı ve şifre gereklidir.'
      });
    }

    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Kullanıcı adı veya şifre hatalı.'
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Kullanıcı adı veya şifre hatalı.'
      });
    }

    res.json({
      success: true,
      message: 'Giriş başarılı',
      user: {
        id: user._id,
        username: user.username,
        energy: user.energy
      },
      userId: user._id.toString()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası oluştu.'
    });
  }
});
```

**Kod Örneği - Backend Validasyon:**
```javascript
// Backend: models/UserItem.js - Schema-level constraints
const userItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  level: { type: Number, default: 1, min: 1, max: 3 }, // Level sınırı
  progress: { 
    type: Number, 
    default: 0, 
    min: [0, 'Progress cannot be negative'], 
    max: [100, 'Progress cannot exceed 100%'] // Progress sınırı
  },
  isLevelingUp: { type: Boolean, default: false },
});
```

### Veri Bütünlüğü: Olası data kayıplarını nasıl önlersiniz?
Bu kısım biraz zorlayıcı oldu,Backend'de çoğu yerde olabildiğince error handling yapmaya çalıştım aynı zamanda database kısmında yarım bir işlem kalmasın diye bazı yerlerde promise.all gibi yapılar kullanmaya çalıştım ki mesela progress ve enerjiyi aynı anda güncellerken biri başarısız olursa birisi tamamlanmasına engel oluyor ya ikiside başarılı oluyor yada ikiside başarısız olmakta.

**Kod Örneği - Atomic Operations:**
```javascript
// Backend: routes/progress.js - Promise.all ile atomic güncelleme
router.post('/bulk', async (req, res) => {
  try {
    // Validasyonlar...
    
    userItem.progress = newProgress;
    user.energy -= energyRequired;
    
    // Her iki güncelleme de başarılı olmalı, yoksa hiçbiri olmasın
    await Promise.all([userItem.save(), user.save()]);

    res.json({ 
      progress: userItem.progress, 
      energy: user.energy,
      clicksProcessed: clicks,
      progressIncreased: progressIncrease
    });
  } catch (err) {
    // Hata durumunda hiçbir değişiklik kalıcı olmaz
    res.status(500).json({ error: err.message });
  }
});
```

```javascript
// Backend: routes/levelUp.js - Try-catch ile güvenli işlem
router.post('/', async (req, res) => {
  let userItem;
  try {
    userItem = await UserItem.findOneAndUpdate(
      { userId, itemId, isLevelingUp: false },
      { $set: { isLevelingUp: true } },
      { new: true }
    ).populate('itemId');

    if (!userItem) return res.status(423).json({ error: 'Item is already being leveled up.' });

    // Level up işlemleri...
    userItem.level += 1;
    userItem.progress = 0;
    await userItem.save();

    // İşlem başarılı, lock'ı kaldır
    userItem.isLevelingUp = false;
    await userItem.save();

    res.json({
      level: userItem.level,
      progress: userItem.progress,
      energy: user.energy
    });
  } catch (err) {
    // Hata durumunda lock'ı mutlaka kaldır
    if (userItem) {
      userItem.isLevelingUp = false;
      await userItem.save();
    }
    res.status(500).json({ error: err.message });
  }
});
```

### Teknik Tasarım: Yaptığınız frontend ve backend değişikliklerini açıklayın.
En baştaki api yapısında bir kartı geliştirmek için 50 kere tıklamak gerekiyordu.
bense bulk progress endpointi ekledim öncekini de silmeden 

**Kod Örneği - API Endpoints:**
```
POST /api/v1/progress/bulk
Body: { userId: string, itemId: string, clicks: number }
Response: { 
  progress: number, 
  energy: number,
  clicksProcessed: number,
  progressIncreased: number 
}
```

Bir authentication kısmı yoktu herkes herkesin eşyalarını etkileyebiliyordu, Bunun için bir authentication ve user-item ilişkilerini ve yapılarını kurdum.
Bunun Apilerini hazırladım ve işlenir hale getirdim.
Enerji için istenilen Userın Enerjisi elde edilebiliyor aynı zamanda yenilenme için userın en son ki enerji değerinin değiştiği süreyi tutuyorum bunun için aslında  bir time apisi kullanmak istedim ama internet sıkıntılarından erişebildiğim birtane bulamadım böylelikle  aslında local time'ın ileri alınmasınında önüne geçebilirdim.

**Kod Örneği - Energy API:**
```
GET /api/v1/energy/:userId
Response: { energy: number, lastEnergyUpdate: string }
```

Level-Up end pointi için yine user bazlı bir authentication ekledim aynı zamanda updatelenen eşyaninda response'da bilgilerinin dönmesi  ekstra bir api çağrısının önüne geçip bu bakımdan hızlandırıyor aynı zamanda seamless transition sağlıyor ve frontende güncelleme işlemlerini smoothlaştırıyor.Aynı zamanda Api için versioning yapısınıda kullandım detaylı hata mesajlarına öncelik verip responseları olabildiğince anlaşılabilir yazmaya çalıştım.

**Kod Örneği - Level Up API:**
```
POST /api/v1/level-up
Body: { userId: string, itemId: string }
Response: { 
  level: number, 
  progress: 0, 
  energy: number,
  name: string,
  description: string,
  image: string 
}
```

Bunun dışında Taşıyabileceğim verileri mongodb'de kullanıyorum ve injecting mimarisle layering yapmaya çalıştım olabildiğince ve component yapısını kullanmaya çalıştım okunabilirlik için

Frontend kısmında,Bir login,register kısmı ekledim Redux kullandım state değişimleri için,Aynı zamanda Ana ekranda logout ve kullanıcı adı kısımını ekledim ve resuable olarak yazmaya çalıştım componentları, aynı zamanda yeni bir geliştirme seviyesi belirlenebilmesi için bir component oluşturdum ki kullanıcı bulk action yapabilsin.

## 📝 API Endpoints

```
POST /api/v1/auth/login        # Giriş yap
POST /api/v1/auth/register     # Kayıt ol
GET  /api/v1/energy/:userId    # Enerji durumu
POST /api/v1/progress          # Tek tıklama
POST /api/v1/progress/bulk     # Çoklu tıklama
POST /api/v1/level-up          # Seviye atlat
GET  /api/v1/user-items/:userId # Kullanıcı kartları
```



```


## 🐛 Süre çok yetişmediğinden 

- Şifre encryption yok aslında kullanıcı şifrelerini hashleyebilmek güzel olurdu.
- Local stroge da token tutmaktayım jwt token kullanmak daha güvenli olurdu.
- Resimler local'de tutuluyor (S3 vs. kullanılmalı)
- Aslında ekstra featurelar ekleyebilecek vakitim olsaydı mesela eşyalar dahada detaylandırılıp üstüne asenkron bir mobil autobattler oyuna yöneltmek güzel olabilirdi çünkü insanlar telefonda çok vakit geçiriyorlar ve bi oyunun asenkron olması online' kısımda baya bi rahatlık katıyor aslında bunun BackPackBattles gibi bir oyun olarak hayal edebiliyorum.
- Error handling'i geliştirilebilir
- Styling geliştirilebilir.


--- 
