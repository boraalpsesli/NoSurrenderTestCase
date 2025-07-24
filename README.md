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

### Problem 2: Edge Caseler
**Edge-Case-1**: Kullanıcı arka arkaya çok fazla Yükselt tuşuna basınca sahip olduğu eşya 1 seviyeden 3 seviyeye çıkabiliyor.
**Çözüm**: Locking mantığı  `isLevelingUp` adında  bir Boolean flag oluşturup bunu kullanarak level up işlemi sırasında backende işlemi locklayıp tamamlanınca açılmasını sağladım böylelikle birden fazla kere seviye atlatılamıyor aynı anda.

**Edge-Case-2**:Çoklu yükseltme sırasında Sahip olunan enerjiden fazlasının kullanılması ve aynı zamanda progresin %100 üstüne çıkılması ve enerji ve progress boşa gitmesi.

**Çözüm**:Birden fazla katmanlı validasyon ve aynı zamanda atomic olarak yaptığım enerji hepsalamasıyla bunun önüne geçiyorum.Model katmanında kullandığım validasyonlar ve yine çok katmanlı validasyon yapısıyla overflowun üstüne çıkıyorum.

**Edge-Case-3**:Enerji yenilenmesine kalan süre hesaplamasında oluşabilecek NaN değerler ve aynı zamanda İnternet gecikmesi ile yaşanabilecek Enerji yenileme problemi.

**Çözüm**:Detaylı validation kontrolü ve fallback değerlerinin yapılması ve aynı zamanda optimistic değerler kullanılarak Client tarafında güncelleme yaparak gecikmelerden oluşucak problemlerin önüne geçiliyor.

### Kullanıcı Deneyimi: Nasıl daha hızlı ve akıcı hale getirirsiniz?
50 kez butona basmak çok yorucu ve sıkıcı bir durum, ben de ClickCounter yapmayı tercih ettim.artık istediğiniz kadar seçebiliyorsunuz buda bunu bu kadar geliştireyim öbür eşyayı ise şu kadar geliştireyim diye aynı zamanda biraz startejik bir tarafıda açıyor.Toast mesajları ekledim ki kullanıcı ne olup bittiğini anlasın.Aynı zamanda bir user sistemi ekledim kullanıcı giriş yapıp çıkabiliyor girdiği zamanda kendini görebiliyor.
### Performans: Sunucu ve network yükünü nasıl azaltırsınız?
En büyük sorunlardan birisi bu bence, 50 tane istek atmak yerine tek bir istek ile çoklu işlem yapmayı düşündüm açıkçası Redux State yapısı kullanarak  çok fazla api isteği atmayı engellemeye çalıştım olduğu kadar,o yüzden bazı veriler clientda mevcut enerji sistemi ise sürekli ping atılmasın diye bir timer sistemi kullandım ki sürekli bir ping atılmasın ve zamanı geldiğinde istek atılsın.Açıkçası birden fazla cihazdan aynı anda gelen istekleri test edemedim ne yazıkki süreden kaynaklı olarak.

### Güvenlik: Kullanıcının sistemi kötüye kullanılmasını nasıl engellersiniz?
ilk başta mesela hızlı tıkladığınız zaman kartı birden fazla kere seviye atlatabiliyordunuz ve frontend'de tuttuğum kontroler güvenlik açığı yaratıyordu bu yezden ilki için bir locking mekanizması kullandım flagle ki böyle bi durum olamasın ve tüm validasyon/kontrolleri backende taşıdım ve frontende güvenilmeyip olabildiğince kontrol yaptım.Aynı zamanda Schema/Model kısmındada constraintler belirlediğimden buda ekstra bir güvenlik katmanı olarak güvenliğe yardımcı oluyor aynı zamandada bir authentication ekleyip bir user bazlı  bir erişim ekledim.
### Veri Bütünlüğü: Olası data kayıplarını nasıl önlersiniz?
Bu kısım biraz zorlayıcı oldu,Backend'de çoğu yerde olabildiğince error handling yapmaya çalıştım aynı zamanda database kısmında yarım bir işlem kalmasın diye bazı yerlerde promise.all gibi yapılar kullanmaya çalıştım ki mesela progress ve enerjiyi aynı anda güncellerken biri başarısız olursa birisi tamamlanmasına engel oluyor ya ikiside başarılı oluyor yada ikiside başarısız olmakta.

### Teknik Tasarım: Yaptığınız frontend ve backend değişikliklerini açıklayın.
En baştaki api yapısında bir kartı geliştirmek için 50 kere tıklamak gerekiyordu.
bense bulk progress endpointi ekledim öncekini de silmeden 
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
Bir authentication kısmı yoktu herkes herkesin eşyalarını etkileyebiliyordu, Bunun için bir authentication ve user-item ilişklerini ve yapılarını kurdum.
Bunun Apilerini hazırladım ve işlenir hale getirdim.
Enerji için istenilen Userın Enerjisi elde edilebiliyor aynı zamanda yenilenme için userın en son ki enerji değerinin değiştiği süreyi tutuyorum bunun için aslında  bir time apisi kullanmak istedim ama internet sıkıntılarından erişebildiğim birtane bulamadım böylelikle  aslında local time'ın ileri alınmasınında önüne geçebilirdim.
```
GET /api/v1/energy/:userId
Response: { energy: number, lastEnergyUpdate: string }
```
Level-Up end pointi için yine user bazlı bir authentication ekledim aynı zamanda updatelenen eşyanında response'da bilgilerinin dönmesi  ekstra bir api çağrısının önüne geçip bu bakımdan hızlandırıyor aynı zamanda seamless transition sağlıyor ve frontende güncelleme işlemlerini smoothlaştırıyor.Aynı zamanda Api için versioning yapısınıda kullandım detaylı hata mesajlarına öncelik verip responseları olabildiğince anlaşılabilir yazmaya çalıştım.
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

