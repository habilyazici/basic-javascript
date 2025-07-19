// ==================== SABİTLER (CONSTANTS) ====================
// CONSTANTS = Sabitler: Değişmeyecek değerleri burada tanımlıyoruz
// Bu sayılar ve yazılar program boyunca aynı kalacak

/**
 * Hayvan Türleri - Simülasyonda kullanılan tüm hayvan türlerinin tanımları
 * Bu sabitler kod boyunca tutarlılık sağlamak için kullanılır
 * 
 * AÇIKLAMA: Object (nesne) yapısı - {} içine anahtar:değer çiftleri yazıyoruz
 * Örnek: KOYUN: 'koyun' - KOYUN anahtarının değeri 'koyun' string'i
 */
export const HAYVAN_TURLERI = {
    KOYUN: 'koyun',        // Otçul, savunmasız hayvan - sadece ot yer
    INEK: 'inek',          // Otçul, büyük hayvan - sadece ot yer ama büyük
    TAVUK: 'tavuk',        // Omnivore, küçük hayvan (dişi) - hem ot hem et yer
    HOROZ: 'horoz',        // Omnivore, küçük hayvan (erkek) - hem ot hem et yer
    KURT: 'kurt',          // Etçil avcı - sadece et yer, diğer hayvanları avlar
    ASLAN: 'aslan'         // Etçil avcı - sadece et yer, en güçlü avcı
};
// export = Bu değişkeni başka dosyalarda da kullanabilmek için dışarı açıyoruz
// const = Değişmez değişken (sabit) tanımlama kelimesi

/**
 * Avcı Türü - İnsan avcısı
 * AÇIKLAMA: String (yazı) türünde bir sabit
 * Bu değişken insan avcısını temsil ediyor
 */
export const AVCI_TURU = 'avci';

/**
 * Avlanma Mesafeleri - Her avcı türünün ne kadar uzaktan avlanabileceği
 * Daha büyük avcılar daha uzak mesafeden avlanabilir
 * 
 * AÇIKLAMA: Object içinde anahtar olarak hayvan türü, değer olarak mesafe
 * [HAYVAN_TURLERI.KURT] = Köşeli parantez ile object anahtarı oluşturma
 * Sayı değerleri piksel cinsinden mesafe
 */
export const AVLANMA_MESAFELERI = {
    [HAYVAN_TURLERI.KURT]: 4,    // Kurt 4 birim mesafeden avlanabilir
    [HAYVAN_TURLERI.ASLAN]: 5    // Aslan 5 birim mesafeden avlanabilir
};

/**
 * Çiftleşme Mesafesi - Hayvanların çiftleşebilmesi için aralarında olması gereken maksimum mesafe
 * AÇIKLAMA: Sadece bir sayı sabit. Bu mesafeden yakın hayvanlar çiftleşebilir
 */
export const CIFTLESME_MESAFESI = 3;

/**
 * Hareket Mesafeleri - Her hayvan türünün bir adımda ne kadar hareket edebileceği
 * Büyük hayvanlar genelde daha hızlı hareket eder
 */
export const HAREKET_MESAFELERI = {
    [HAYVAN_TURLERI.KOYUN]: 2,     // Koyun orta hızda hareket eder
    [HAYVAN_TURLERI.INEK]: 2,      // İnek orta hızda hareket eder
    [HAYVAN_TURLERI.TAVUK]: 1,     // Tavuk yavaş hareket eder
    [HAYVAN_TURLERI.HOROZ]: 1,     // Horoz yavaş hareket eder
    [HAYVAN_TURLERI.KURT]: 3,      // Kurt hızlı hareket eder
    [HAYVAN_TURLERI.ASLAN]: 4,     // Aslan en hızlı hareket eder
    [AVCI_TURU]: 1                 // Avcı yavaş ama stratejik hareket eder
};

// ==================== YARDIMCI FONKSİYONLAR (HELPER FUNCTIONS) ====================
// FUNCTIONS = Fonksiyonlar: Tekrar kullanabileceğimiz kod blokları
// Her fonksiyon belirli bir işi yapar ve sonuç döndürür

/**
 * Rastgele Pozisyon Üretici
 * Simülasyon alanında (500x500) rastgele bir koordinat üretir
 * 
 * AÇIKLAMA: function kelimesi ile fonksiyon tanımlıyoruz
 * () içi parametre - bu fonksiyon parametre almıyor
 * {} içi fonksiyonun yapacağı işler
 * return = fonksiyonun döndüreceği değer
 * 
 * @returns {number} 0-499 arası rastgele sayı
 */
export function rastgelePozisyonAl() {
    // Math.random() = 0 ile 1 arası rastgele ondalık sayı üretir (örn: 0.7234)
    // Math.random() * 500 = 0 ile 500 arası ondalık sayı (örn: 361.7)
    // Math.floor() = Ondalık sayıyı aşağı yuvarlar (örn: 361.7 -> 361)
    // Sonuç: 0-499 arası tam sayı
    return Math.floor(Math.random() * 500); // 0-499 arası pozisyon (500x500 alan)
}

/**
 * Rastgele Cinsiyet Üretici
 * %50-50 şansla erkek veya dişi cinsiyet belirler
 * 
 * AÇIKLAMA: Şartlı operatör (ternary operator) kullanımı
 * koşul ? doğruysa_bu : yanlışsa_bu
 * 
 * @returns {string} 'erkek' veya 'disi' değeri
 */
export function rastgeleCinsiyetAl() {
    // Math.random() < 0.5 = %50 şans true, %50 şans false
    // ? işareti şartlı operatör başlangıcı
    // true ise 'erkek', false ise 'disi' döndür
    return Math.random() < 0.5 ? 'erkek' : 'disi';
}

/**
 * İki Nokta Arası Mesafe Hesaplayıcı
 * Manhattan mesafesi kullanır (|x1-x2| + |y1-y2|)
 * Bu hesaplama simülasyonda performans için tercih edilir
 * 
 * AÇIKLAMA: Fonksiyon parametreleri
 * (a, b) = Bu fonksiyon 2 parametre alır: a ve b
 * a ve b nesneler olmalı ve x, y özellikleri olmalı
 * Math.abs() = Mutlak değer alır (negatif sayıları pozitif yapar)
 * 
 * @param {Object} a - İlk nesne (x, y koordinatları olan)
 * @param {Object} b - İkinci nesne (x, y koordinatları olan)
 * @returns {number} İki nokta arası mesafe
 */
export function mesafeHesapla(a, b) {
    // a.x = a nesnesinin x özelliği
    // b.x = b nesnesinin x özelliği
    // Math.abs(a.x - b.x) = X koordinatları arası farkın mutlak değeri
    // Math.abs(a.y - b.y) = Y koordinatları arası farkın mutlak değeri
    // + ile ikisini topluyoruz (Manhattan mesafesi)
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// ==================== SINIFLAR (CLASSES) ====================
// CLASS = Sınıf: Nesnelerin şablonunu tanımlar
// Sınıftan yeni nesneler oluşturabiliriz (instance)

/**
 * Hayvan Sınıfı - Tüm hayvanların temel özelliklerini tanımlar
 * Bu sınıf simülasyondaki tüm hayvan türleri için kullanılır
 * 
 * AÇIKLAMA: Class bir şablon gibidir
 * Bu şablondan istediğimiz kadar hayvan nesnesi oluşturabiliriz
 * Her hayvan kendine özel x, y, enerji değerlerine sahip olur
 */
export class Hayvan {
    /**
     * Yeni bir hayvan oluşturur (Constructor = Yapıcı fonksiyon)
     * AÇIKLAMA: constructor özel bir fonksiyondur
     * Yeni nesne oluşturulurken otomatik çalışır
     * new Hayvan() dendiğinde bu çalışır
     * 
     * @param {string} tur - Hayvan türü (HAYVAN_TURLERI'nden biri)
     * @param {string} cinsiyet - Hayvan cinsiyeti ('erkek' veya 'disi')
     * @param {number} x - X koordinatı (0-499 arası)
     * @param {number} y - Y koordinatı (0-499 arası)
     */
    constructor(tur, cinsiyet, x, y) {
        // this = Bu nesne (oluşturulan hayvan nesnesi)
        // this.tur = Bu nesnenin tur özelliği
        // Gelen parametreleri nesnenin özelliklerine atıyoruz
        this.tur = tur;               // Hayvan türü - dışarıdan gelen parametre
        this.cinsiyet = cinsiyet;     // Hayvan cinsiyeti - dışarıdan gelen parametre
        this.x = x;                   // X pozisyonu - dışarıdan gelen parametre
        this.y = y;                   // Y pozisyonu - dışarıdan gelen parametre
        this.enerji = 100;            // Başlangıç enerjisi (sabit değer - her hayvan 100 ile başlar)
        this.hayatta = true;          // Hayat durumu (boolean - true/false)
    }

    /**
     * Hayvanın hareket etme fonksiyonu
     * Her hayvan türü kendi hızında rastgele yönde hareket eder
     * Hareket sırasında enerji tüketir ve sınırları kontrol eder
     * 
     * AÇIKLAMA: Sınıf içindeki fonksiyon (method)
     * Bu fonksiyon sadece hayvan nesneleri tarafından çağrılabilir
     * 
     * @param {Object} avci - Avcı nesnesi (şu an kullanılmıyor)
     * @param {Array} hayvanlar - Diğer hayvanlar listesi (şu an kullanılmıyor)
     */
    hareket(avci, hayvanlar) {
        // Bu hayvanın türüne göre hareket mesafesini al
        // HAREKET_MESAFELERI[this.tur] = Bu hayvanın türü için tanımlı hız
        const hareketMesafesi = HAREKET_MESAFELERI[this.tur];
        
        // 4 temel yön tanımla (sağ, aşağı, sol, yukarı)
        // Array (dizi) - [] içinde değerleri liste halinde tutar
        const dx = [0, 1, 0, -1];  // X yönündeki değişimler (sağ=+1, sol=-1, dikey=0)
        const dy = [1, 0, -1, 0];  // Y yönündeki değişimler (aşağı=+1, yukarı=-1, yatay=0)
        
        // 0, 1, 2 veya 3 değerlerinden birini rastgele seç
        const yon = Math.floor(Math.random() * 4);  // Rastgele yön seç (0-3 arası)
        
        // Belirtilen mesafe kadar seçilen yönde hareket et
        // dx[yon] = Seçilen yöndeki x değişimi
        // dy[yon] = Seçilen yöndeki y değişimi
        // Math.max(0, ...) = 0'dan küçük olmasın
        // Math.min(499, ...) = 499'dan büyük olmasın
        this.x = Math.max(0, Math.min(499, this.x + dx[yon] * hareketMesafesi));
        this.y = Math.max(0, Math.min(499, this.y + dy[yon] * hareketMesafesi));
        
        // Enerji çok yavaş azalsın (her 10 harekette 1 enerji)
        // Bu dengeli bir ekosistem için gerekli
        // Math.random() < 0.1 = %10 şans ile true
        if (Math.random() < 0.1) {
            // Math.max(0, ...) = Enerji 0'dan küçük olmasın
            this.enerji = Math.max(0, this.enerji - 1);
        }
        
        // Enerji biterse hayvan ölür
        // === tam eşitlik kontrolü (tür ve değer aynı olmalı)
        if (this.enerji === 0) this.hayatta = false;
    }
}

/**
 * Avcı Sınıfı - İnsan avcısını temsil eder
 * Hayvanları avlayabilen özel bir karakter
 * 
 * AÇIKLAMA: Bu da bir sınıf ama Hayvan sınıfından farklı
 * Avcının kendine özel özellikleri var
 */
export class Avci {
    /**
     * Yeni bir avcı oluşturur
     * AÇIKLAMA: Avcı constructor'ı daha basit - sadece konum alır
     * 
     * @param {number} x - X koordinatı
     * @param {number} y - Y koordinatı
     */
    constructor(x, y) {
        this.x = x;                  // X pozisyonu - dışarıdan gelen
        this.y = y;                  // Y pozisyonu - dışarıdan gelen
        this.gorusAlani = 8;         // Avcı 8 birim yakınlıktaki hayvanları görebilir ve avlayabilir
    }

    /**
     * Avcının hareket etme fonksiyonu
     * Avcı yavaş ama stratejik hareket eder
     * 
     * AÇIKLAMA: Hayvan hareket fonksiyonu ile benzer ama daha basit
     * Avcı parametre almaz çünkü başka hiçbir şeye bağlı değil
     */
    hareket() {
        // Avcı 1 birim hareket eder (stratejik hareket)
        const dx = [0, 1, 0, -1];  // Yön değişimleri (aynı mantık)
        const dy = [1, 0, -1, 0];
        const yon = Math.floor(Math.random() * 4);  // Rastgele yön (0-3)
        
        // Sınırlar içinde hareket et
        // HAREKET_MESAFELERI[AVCI_TURU] = Avcının hareket hızı (1)
        this.x = Math.max(0, Math.min(499, this.x + dx[yon] * HAREKET_MESAFELERI[AVCI_TURU]));
        this.y = Math.max(0, Math.min(499, this.y + dy[yon] * HAREKET_MESAFELERI[AVCI_TURU]));
    }
}

// ==================== İSTATİSTİKLER (STATISTICS) ====================
// GLOBAL VARIABLES = Global Değişkenler: Dosyanın her yerinden erişilebilir

/**
 * Simülasyon istatistikleri - Global değişkenler
 * Bu değişkenler simülasyon boyunca çeşitli olayları takip eder
 * 
 * AÇIKLAMA: let ile değişken tanımlama
 * let = Değiştirilebilir değişken (const'ın aksine)
 * Bu sayılar simülasyon sırasında artacak
 */
let doganSayisi = 0;        // Toplam doğan hayvan sayısı - 0'dan başlar
let avciOldurmeSayisi = 0;  // Avcının öldürdüğü hayvan sayısı - 0'dan başlar
let aslanOldurmeSayisi = 0; // Aslanların öldürdüğü hayvan sayısı - 0'dan başlar
let kurtOldurmeSayisi = 0;  // Kurtların öldürdüğü hayvan sayısı - 0'dan başlar

/**
 * İstatistikleri döndüren fonksiyon
 * Simülasyon sonunda veya ara raporlarda kullanılır
 * 
 * AÇIKLAMA: Bu fonksiyon parametre almaz ama bir nesne döndürür
 * {} içinde anahtar: değer şeklinde nesne oluşturur
 * 
 * @returns {Object} Tüm istatistikleri içeren nesne
 */
export function istatistikleriAl() {
    // Object return etme - birden fazla değeri tek seferde döndürür
    return { 
        doganSayisi,           // doganSayisi: doganSayisi ile aynı (ES6 kısayolu)
        avciOldurmeSayisi,     // avciOldurmeSayisi: avciOldurmeSayisi ile aynı
        aslanOldurmeSayisi,    // aslanOldurmeSayisi: aslanOldurmeSayisi ile aynı
        kurtOldurmeSayisi      // kurtOldurmeSayisi: kurtOldurmeSayisi ile aynı
    };
}

/**
 * İstatistikleri sıfırlayan fonksiyon
 * Yeni simülasyon başlatılırken kullanılır
 * 
 * AÇIKLAMA: Bu fonksiyon global değişkenleri 0'a resetler
 * Yeni simülasyon başlarken temiz başlamak için
 */
export function istatistikleriSifirla() {
    // Global değişkenleri 0'a eşitle
    doganSayisi = 0;           // = atama operatörü (yeni değer ver)
    avciOldurmeSayisi = 0;
    aslanOldurmeSayisi = 0;
    kurtOldurmeSayisi = 0;
}

// ==================== BAŞLANGIÇ POPÜLASYONU (INITIAL POPULATION) ====================
// POPULATION = Popülasyon: Başlangıçta kaç hayvan olacağını belirler

/**
 * Başlangıç hayvan popülasyonunu oluşturan fonksiyon
 * Dengeli bir ekosistem için çeşitli hayvan türlerinden belirli sayıda oluşturur
 * 
 * AÇIKLAMA: Bu fonksiyon bir Array (dizi) döndürür
 * Array içinde Hayvan nesneleri olacak
 * [] = Boş array, push() ile eleman eklenir
 * 
 * @returns {Array} Başlangıç hayvanları dizisi
 */
export function hayvanlariBaslat() {
    // Boş array oluştur - hayvanları buraya ekleyeceğiz
    const hayvanlar = []; // [] = boş dizi
    
    // KOYUNLAR - Otçul, temel besin kaynağı (15 çift = 30 adet)
    // for döngüsü - belirli sayıda tekrar yapar
    // for (başlangıç; koşul; artış) - i=0'dan başla, i<15 olana kadar, her seferde i'yi 1 artır
    for (let i = 0; i < 15; i++) {
        // Her türden eşit sayıda erkek ve dişi oluştur
        // new Hayvan() = Yeni hayvan nesnesi oluştur
        // push() = Array'e yeni eleman ekle
        hayvanlar.push(new Hayvan(HAYVAN_TURLERI.KOYUN, 'erkek', rastgelePozisyonAl(), rastgelePozisyonAl()));
        hayvanlar.push(new Hayvan(HAYVAN_TURLERI.KOYUN, 'disi', rastgelePozisyonAl(), rastgelePozisyonAl()));
    }
    
    // İNEKLER - Otçul, büyük hayvanlar (5 çift = 10 adet)
    for (let i = 0; i < 5; i++) {
        hayvanlar.push(new Hayvan(HAYVAN_TURLERI.INEK, 'erkek', rastgelePozisyonAl(), rastgelePozisyonAl()));
        hayvanlar.push(new Hayvan(HAYVAN_TURLERI.INEK, 'disi', rastgelePozisyonAl(), rastgelePozisyonAl()));
    }
    
    // TAVUKLAR - Omnivore, küçük hayvanlar (sadece dişi, 10 adet)
    for (let i = 0; i < 10; i++) {
        hayvanlar.push(new Hayvan(HAYVAN_TURLERI.TAVUK, 'disi', rastgelePozisyonAl(), rastgelePozisyonAl()));
    }
    
    // HOROZLAR - Omnivore, küçük hayvanlar (sadece erkek, 10 adet)
    for (let i = 0; i < 10; i++) {
        hayvanlar.push(new Hayvan(HAYVAN_TURLERI.HOROZ, 'erkek', rastgelePozisyonAl(), rastgelePozisyonAl()));
    }
    
    // KURTLAR - Etçil avcılar (5 çift = 10 adet)
    for (let i = 0; i < 5; i++) {
        hayvanlar.push(new Hayvan(HAYVAN_TURLERI.KURT, 'erkek', rastgelePozisyonAl(), rastgelePozisyonAl()));
        hayvanlar.push(new Hayvan(HAYVAN_TURLERI.KURT, 'disi', rastgelePozisyonAl(), rastgelePozisyonAl()));
    }
    
    // ASLANLAR - En güçlü avcılar (4 çift = 8 adet)
    for (let i = 0; i < 4; i++) {
        hayvanlar.push(new Hayvan(HAYVAN_TURLERI.ASLAN, 'erkek', rastgelePozisyonAl(), rastgelePozisyonAl()));
        hayvanlar.push(new Hayvan(HAYVAN_TURLERI.ASLAN, 'disi', rastgelePozisyonAl(), rastgelePozisyonAl()));
    }
    
    // Oluşturulan hayvanlar dizisini döndür
    return hayvanlar;
}

// ==================== AFET/HASTALIK KONTROLÜ (DISASTER/DISEASE CONTROL) ====================
// POPULATION CONTROL = Popülasyon Kontrolü: Çok fazla hayvan olursa hastalık çıkarır

/**
 * Popülasyon kontrolü için afet/hastalık sistemi
 * Herhangi bir tür çok fazla çoğalırsa otomatik olarak hastalık çıkarır
 * Bu sistem ekosistemin dengesini korumak için kritiktir
 * 
 * AÇIKLAMA: Bu fonksiyon hayvan sayılarını kontrol eder
 * Bir tür çok fazla olursa bazılarını öldürür (hastalık simülasyonu)
 * 
 * @param {Array} hayvanlar - Mevcut hayvanlar listesi
 */
export function gerekliiseAfetUygula(hayvanlar) {
    // Her türden kaç hayvan olduğunu say
    // {} = Boş nesne oluştur, burada sayıları tutacağız
    const turSayilari = {};
    
    // forEach = Array'deki her eleman için fonksiyon çalıştır
    // (hayvan) => { } = Arrow function (ok fonksiyonu) - kısa fonksiyon yazma yöntemi
    hayvanlar.forEach(hayvan => {
        // Eğer bu türden daha önce saymadıysak, 0 ile başlat
        // ! = Değil operatörü, turSayilari[hayvan.tur] yoksa true döner
        if (!turSayilari[hayvan.tur]) turSayilari[hayvan.tur] = 0;
        
        // Hayvan hayattaysa sayıyı 1 artır
        // ++ = 1 artır operatörü
        if (hayvan.hayatta) turSayilari[hayvan.tur]++;
    });
    
    // Her tür için kontrol et
    // Object.entries() = Nesneyi [anahtar, değer] çiftlerine çevirir
    // forEach ile her çift üzerinde döner
    Object.entries(turSayilari).forEach(([tur, sayi]) => {
        // 100'den fazla olunca afet tetiklenir
        // > = Büyüktür karşılaştırması
        if (sayi > 100) {
            // Console.log = Konsola mesaj yazdır (kullanıcıya bilgi ver)
            // Template literal - `` içinde ${değişken} ile değişken kullanma
            console.log(`⚠️ AFET/HASTALIK: ${tur} popülasyonu kritik seviyede (${sayi}), %20'si hastalandı!`);
            
            let oldurulenSayi = 0;  // Kaç hayvan öldürüldüğünü say
            // Math.floor = Aşağı yuvarla, sayi * 0.2 = %20'si
            const oldurmHedefi = Math.floor(sayi * 0.2); // %20'sini öldür
            
            // Rastgele hayvanları hastalıktan öldür
            hayvanlar.forEach(hayvan => {
                // && = Ve operatörü, tüm koşullar doğru olmalı
                // < = Küçüktür karşılaştırması
                if (hayvan.tur === tur && hayvan.hayatta && oldurulenSayi < oldurmHedefi && Math.random() < 0.25) {
                    hayvan.hayatta = false;  // Hayvanı öldür
                    oldurulenSayi++;         // Sayacı artır
                }
            });
            
            console.log(`💀 ${oldurulenSayi} ${tur} hastalandı ve öldü.`);
        }
    });
}

// ==================== AVLANMA VE ÇİFTLEŞME (HUNTING AND MATING) ====================
// HUNTING = Avlanma, MATING = Çiftleşme: Simülasyonun en önemli kısımları

/**
 * Avlanma ve çiftleşme sistemini yöneten ana fonksiyon
 * Bu fonksiyon simülasyonun en kritik kısmıdır ve şu işlemleri yapar:
 * 1. Avcı avlanması
 * 2. Aslan avlanması
 * 3. Kurt avlanması  
 * 4. Çiftleşme işlemleri
 * 
 * AÇIKLAMA: Bu fonksiyon çok karmaşık ama adım adım açıklayacağım
 * Her bölüm farklı bir işi yapıyor
 * 
 * @param {Array} hayvanlar - Mevcut hayvanlar listesi
 * @param {Object} avci - Avcı nesnesi
 * @returns {Array} Güncellenmiş hayvanlar listesi (ölüler çıkarılmış, yeni doğanlar eklenmiş)
 */
export function avlanVeCiftles(hayvanlar, avci) {
    let yeniHayvanlar = [];           // Yeni doğacak hayvanlar listesi - boş başlar
    let avlananIndeksler = new Set(); // Avlanan hayvanların indeksleri - Set = Tekrarsız liste
    
    // ========== AVCI AVLANMASI ==========
    // Avcı en yakın hayvanı arar ve belirli şansla avlar
    
    // Avcının görüş alanından daha uzak mesafe ile başla
    let enKisaMesafe = avci.gorusAlani + 1;  // Görüş alanından başla (9)
    let enYakinIndeks = -1;                  // -1 = Henüz hayvan bulunamadı
    
    // Tüm hayvanları kontrol et ve en yakınını bul
    // forEach ile her hayvanı kontrol et, (hayvan, i) = hayvan nesnesi ve index numarası
    hayvanlar.forEach((hayvan, i) => {
        // Ölü hayvanları atla - return = fonksiyondan çık
        if (!hayvan.hayatta) return; // Ölü hayvanları atla
        
        // Bu hayvan ile avcı arasındaki mesafeyi hesapla
        const mesafe = mesafeHesapla(avci, hayvan);
        
        // <= = Küçük eşit, && = Ve operatörü
        // Hem görüş alanında hem de şu ana kadarki en yakın olmalı
        if (mesafe <= avci.gorusAlani && mesafe < enKisaMesafe) {
            enKisaMesafe = mesafe;    // Yeni en kısa mesafe
            enYakinIndeks = i;        // Bu hayvanın index numarası
        }
    });
    
    // En yakın hayvanı %30 şans ile avla
    // !== = Eşit değil karşılaştırması
    // Math.random() < 0.3 = %30 şans
    if (enYakinIndeks !== -1 && Math.random() < 0.3) {
        hayvanlar[enYakinIndeks].hayatta = false;    // O hayvanı öldür
        avlananIndeksler.add(enYakinIndeks);         // Set'e ekle (avlandı işareti)
        avciOldurmeSayisi++;                         // İstatistik artır
    }
    
    // ========== ASLAN AVLANMASI ==========
    // Aslanlar koyun ve inek avlar
    
    // İç içe forEach döngüsü - her aslan için tüm hayvanları kontrol et
    // Dış döngü: Tüm hayvanları gez (aslan arayacağız)
    hayvanlar.forEach((hayvan, i) => {
        if (!hayvan.hayatta) return; // Ölü hayvanları atla
        
        // Bu hayvan aslan mı?
        if (hayvan.tur === HAYVAN_TURLERI.ASLAN) {
            // İç döngü: Bu aslan için tüm potansiyel avları kontrol et
            hayvanlar.forEach((av, j) => {
                // Geçersiz durumları atla:
                // - Av ölüyse atla
                // - Kendisiyse atla (i === j)
                // - Zaten avlanmışsa atla
                if (!av.hayatta || i === j || avlananIndeksler.has(j)) return;
                
                // Aslanlar sadece koyun ve inek avlar
                // || = Veya operatörü
                // <= = Küçük eşit karşılaştırması
                if ((av.tur === HAYVAN_TURLERI.KOYUN || av.tur === HAYVAN_TURLERI.INEK) && 
                    mesafeHesapla(hayvan, av) <= AVLANMA_MESAFELERI[HAYVAN_TURLERI.ASLAN]) {
                    
                    // %50 şans ile avla
                    if (Math.random() < 0.5) {
                        av.hayatta = false;              // Avı öldür
                        avlananIndeksler.add(j);         // Avlandı işareti koy
                        hayvan.enerji += 5;              // Avlayan aslanın enerjisi artar
                        aslanOldurmeSayisi++;            // İstatistik artır
                    }
                }
            });
        }
    });
    
    // ========== KURT AVLANMASI ==========
    // Kurtlar koyun, tavuk ve horoz avlar (aslanlardan farklı av türleri)
    hayvanlar.forEach((hayvan, i) => {
        if (!hayvan.hayatta) return;
        
        // Bu hayvan kurt mu?
        if (hayvan.tur === HAYVAN_TURLERI.KURT) {
            hayvanlar.forEach((av, j) => {
                if (!av.hayatta || i === j || avlananIndeksler.has(j)) return;
                
                // Kurtlar koyun, tavuk ve horoz avlar (aslanlardan farklı)
                if ((av.tur === HAYVAN_TURLERI.KOYUN || 
                     av.tur === HAYVAN_TURLERI.TAVUK || 
                     av.tur === HAYVAN_TURLERI.HOROZ) && 
                    mesafeHesapla(hayvan, av) <= AVLANMA_MESAFELERI[HAYVAN_TURLERI.KURT]) {
                    
                    // %50 şans ile avla
                    if (Math.random() < 0.5) {
                        av.hayatta = false;
                        avlananIndeksler.add(j);
                        hayvan.enerji += 5;  // Avlanan kurt enerji kazanır
                        kurtOldurmeSayisi++;
                    }
                }
            });
        }
    });

    
    // ========== ÇİFTLEŞME SİSTEMİ ==========
    // Hayvanların çiftleşme işlemleri - yeni hayvan üretme
    
    // Çiftleşen hayvanları takip et (bir hayvan sadece bir kez çiftleşebilir)
    let ciftlesenIndeksler = new Set(); // Set = Tekrarsız liste
    
    // İç içe for döngüsü - her hayvan çifti kontrol et
    // Dış döngü: İlk hayvan
    for (let i = 0; i < hayvanlar.length; i++) {
        // Geçersiz durumları atla:
        // - Ölüyse atla
        // - Zaten çiftleştiyse atla  
        // - Avlandıysa atla
        if (!hayvanlar[i].hayatta || ciftlesenIndeksler.has(i) || avlananIndeksler.has(i)) continue;
        
        // Enerji kontrolü - düşük enerjili hayvanlar çiftleşemez
        // continue = Bu döngü adımını atla, sonrakine geç
        if (hayvanlar[i].enerji < 10) continue;
        
        // İç döngü: İkinci hayvanı ara (j = i + 1 çünkü aynı çiftleri tekrar kontrol etmek istemiyoruz)
        for (let j = i + 1; j < hayvanlar.length; j++) {
            // İkinci hayvan için de aynı kontroller
            if (!hayvanlar[j].hayatta || ciftlesenIndeksler.has(j) || avlananIndeksler.has(j)) continue;
            if (hayvanlar[j].enerji < 10) continue; // Enerji kontrolü
            
            // Çiftleşme koşulları (hepsi aynı anda doğru olmalı):
            // 1. Aynı tür olmalı (koyun-koyun, aslan-aslan vs.)
            // 2. Farklı cinsiyet olmalı (erkek-dişi)
            // 3. Yeterince yakın olmalı
            // !== = Eşit değil karşılaştırması
            if (hayvanlar[i].tur === hayvanlar[j].tur &&
                hayvanlar[i].cinsiyet !== hayvanlar[j].cinsiyet &&
                mesafeHesapla(hayvanlar[i], hayvanlar[j]) <= CIFTLESME_MESAFESI) {
                
                // Çiftleşme şansı %15 (dengeli çoğalma için)
                // > 0.15 = %85 şansla çiftleşmeme (%15 şansla çiftleşme)
                if (Math.random() > 0.15) continue; // Şansız, sonraki hayvanı dene
                
                // Normal hayvanlar için çiftleşme (koyun, inek, kurt, aslan)
                // includes() = Array içinde bu değer var mı kontrol eder
                if ([HAYVAN_TURLERI.KOYUN, HAYVAN_TURLERI.INEK, HAYVAN_TURLERI.KURT, HAYVAN_TURLERI.ASLAN].includes(hayvanlar[i].tur)) {
                    // Yeni hayvan iki ebeveynin ortasında doğar
                    // Math.round() = En yakın tam sayıya yuvarla
                    const yeniX = Math.round((hayvanlar[i].x + hayvanlar[j].x) / 2);
                    const yeniY = Math.round((hayvanlar[i].y + hayvanlar[j].y) / 2);
                    
                    // Yeni hayvan oluştur ve listeye ekle
                    yeniHayvanlar.push(new Hayvan(
                        hayvanlar[i].tur,         // Ebeveynle aynı tür
                        rastgeleCinsiyetAl(),     // Rastgele cinsiyet
                        yeniX,                    // Hesaplanan X pozisyonu
                        yeniY                     // Hesaplanan Y pozisyonu
                    ));
                    
                    doganSayisi++;                    // İstatistik artır
                    ciftlesenIndeksler.add(i);        // Bu hayvan çiftleşti
                    ciftlesenIndeksler.add(j);        // Bu hayvan da çiftleşti
                    
                    // Çiftleşen hayvanların enerjisi azalır (yorucu işlem)
                    hayvanlar[i].enerji -= 3;
                    hayvanlar[j].enerji -= 3;
                    break; // Bu hayvan çiftleşti, başkasını ara (iç döngüden çık)
                    
                } else if (hayvanlar[i].tur === HAYVAN_TURLERI.TAVUK || hayvanlar[i].tur === HAYVAN_TURLERI.HOROZ) {
                    // Tavuk-Horoz çiftleşmesi özel durum (farklı türler çiftleşebilir)
                    const yeniX = Math.round((hayvanlar[i].x + hayvanlar[j].x) / 2);
                    const yeniY = Math.round((hayvanlar[i].y + hayvanlar[j].y) / 2);
                    
                    // %70 tavuk, %30 horoz doğma ihtimali
                    // ? : = Şartlı operatör (ternary)
                    const yeniTur = Math.random() < 0.7 ? HAYVAN_TURLERI.TAVUK : HAYVAN_TURLERI.HOROZ;
                    const yeniCinsiyet = yeniTur === HAYVAN_TURLERI.TAVUK ? 'disi' : 'erkek';
                    
                    yeniHayvanlar.push(new Hayvan(yeniTur, yeniCinsiyet, yeniX, yeniY));
                    
                    doganSayisi++;
                    ciftlesenIndeksler.add(i);
                    ciftlesenIndeksler.add(j);
                    
                    // Çiftleşen hayvanların enerjisi azalır
                    hayvanlar[i].enerji -= 3;
                    hayvanlar[j].enerji -= 3;
                    break; // Bu hayvan çiftleşti, başkasını ara
                }
            }
        }
    }

    // ========== SONUÇLARI UYGULA ==========
    // Avlanan ve ölü hayvanları çıkar, yeni doğanları ekle
    
    // filter() = Array'den koşulu sağlayan elemanları filtreler
    // (hayvan, indeks) => ... = Her hayvan ve index numarası için fonksiyon
    // ! = Değil operatörü
    // avlananIndeksler.has(indeks) = Bu index avlananlar listesinde var mı?
    // && = Ve operatörü - her iki koşul da doğru olmalı
    hayvanlar = hayvanlar.filter((hayvan, indeks) => !avlananIndeksler.has(indeks) && hayvan.hayatta);
    
    // ... = Spread operator - array'i elemanlarına ayırır
    // push(...yeniHayvanlar) = yeniHayvanlar array'indeki tüm elemanları tek tek ekle
    hayvanlar.push(...yeniHayvanlar);
    
    // Güncellenmiş hayvanlar listesini döndür
    return hayvanlar;
}

// ==================== ANA SİMÜLASYON DÖNGÜSÜ (MAIN SIMULATION LOOP) ====================

/**
 * Ana simülasyon döngüsü - Belirtilen adım sayısı kadar simülasyonu çalıştırır
 * Her adımda şu işlemler gerçekleşir:
 * 1. Afet/hastalık kontrolü
 * 2. Hayvan hareketleri  
 * 3. Avcı hareketi
 * 4. Avlanma ve çiftleşme işlemleri
 * 5. Ölü hayvanları temizleme
 * 
 * @param {Array} hayvanlar - Mevcut hayvanlar listesi
 * @param {Object} avci - Avcı nesnesi
 * @param {number} hareketSayisi - Kaç adım simülasyon çalıştırılacağı
 * @returns {Array} Simülasyon sonundaki hayvanlar listesi
 */
export function simulasyonuCalistir(hayvanlar, avci, hareketSayisi) {
    // Belirtilen adım sayısı kadar döngü çalıştır
    for (let adim = 0; adim < hareketSayisi; adim++) {
        // 1. Popülasyon kontrolü - gerekirse afet uygula
        gerekliiseAfetUygula(hayvanlar);
        
        // 2. Tüm hayvanları hareket ettir
        hayvanlar.forEach(hayvan => {
            if (hayvan.hayatta) {
                hayvan.hareket(avci, hayvanlar);
            }
        });
        
        // 3. Avcıyı hareket ettir
        avci.hareket();
        
        // 4. Avlanma ve çiftleşme işlemlerini gerçekleştir
        hayvanlar = avlanVeCiftles(hayvanlar, avci);
        
        // 5. Ölü hayvanları listeden çıkar (güvenlik için)
        hayvanlar = hayvanlar.filter(hayvan => hayvan.hayatta);
    }
    
    return hayvanlar;
}

// ==================== ÇALIŞTIRMA BLOĞU (EXECUTION BLOCK) ====================

/**
 * Bu blok dosya doğrudan çalıştırıldığında devreye girer
 * Simülasyonu başlatır ve sonuçları gösterir
 */
if (process.argv[1] && process.argv[1].endsWith('simulation-all-in-one.js')) {
    console.log("🌍 EKOSİSTEM SİMÜLASYONU BAŞLATIILIYOR...\n");
    
    // Başlangıç popülasyonunu oluştur
    const hayvanlar = hayvanlariBaslat();
    
    // Avcıyı rastgele pozisyonda oluştur
    const avci = new Avci(rastgelePozisyonAl(), rastgelePozisyonAl());
    
    // Başlangıç durumunu göster
    console.log("📊 BAŞLANGIÇ HAYVAN SAYILARI:");
    console.log("=" .repeat(40));
    const baslangicSayilari = {};
    hayvanlar.forEach(hayvan => {
        baslangicSayilari[hayvan.tur] = (baslangicSayilari[hayvan.tur] || 0) + 1;
    });
    
    Object.entries(baslangicSayilari).forEach(([tur, sayi]) => {
        console.log(`${tur.toUpperCase().padEnd(8)}: ${sayi.toString().padStart(3)} adet`);
    });
    console.log("-".repeat(40));
    console.log(`TOPLAM  : ${hayvanlar.length.toString().padStart(3)} hayvan`);
    console.log(`AVCI    : 1 adet (Pozisyon: ${avci.x}, ${avci.y})`);
    
    console.log("\n🔄 SİMÜLASYON ÇALIŞIYOR... (1000 adım)");
    console.log("=" .repeat(50));
    
    // Simülasyonu 1000 adım çalıştır
    const zamanBaslangic = Date.now();
    const sonHayvanlar = simulasyonuCalistir(hayvanlar, avci, 1000);
    const zamanBitis = Date.now();
    const gecenSure = zamanBitis - zamanBaslangic;
    
    // Sonuçları göster
    console.log("\n🏁 SİMÜLASYON TAMAMLANDI!");
    console.log("=" .repeat(50));
    console.log(`⏱️  Geçen süre: ${gecenSure}ms`);
    
    console.log("\n📈 HAYATTA KALAN HAYVAN SAYILARI:");
    console.log("=" .repeat(40));
    const sonSayilar = {};
    sonHayvanlar.forEach(hayvan => {
        if (!hayvan.hayatta) return;
        sonSayilar[hayvan.tur] = (sonSayilar[hayvan.tur] || 0) + 1;
    });
    
    Object.entries(sonSayilar).forEach(([tur, sayi]) => {
        const baslangicSayisi = baslangicSayilari[tur] || 0;
        const degisim = sayi - baslangicSayisi;
        const degisimMetni = degisim > 0 ? `(+${degisim})` : `(${degisim})`;
        const durum = degisim > 0 ? "📈" : degisim < 0 ? "📉" : "➡️ ";
        
        console.log(`${tur.toUpperCase().padEnd(8)}: ${sayi.toString().padStart(3)} adet ${durum} ${degisimMetni}`);
    });
    console.log("-".repeat(40));
    console.log(`TOPLAM  : ${sonHayvanlar.length.toString().padStart(3)} hayvan`);
    
    // İstatistikleri göster
    console.log("\n📊 DETAYLI İSTATİSTİKLER:");
    console.log("=" .repeat(40));
    const istatistikler = istatistikleriAl();
    console.log(`🐣 Doğan hayvan sayısı    : ${istatistikler.doganSayisi}`);
    console.log(`🏹 Avcının öldürdüğü      : ${istatistikler.avciOldurmeSayisi}`);
    console.log(`🦁 Aslanların öldürdüğü   : ${istatistikler.aslanOldurmeSayisi}`);
    console.log(`🐺 Kurtların öldürdüğü    : ${istatistikler.kurtOldurmeSayisi}`);
    console.log(`💀 Toplam ölüm           : ${istatistikler.avciOldurmeSayisi + istatistikler.aslanOldurmeSayisi + istatistikler.kurtOldurmeSayisi}`);
    
    console.log("\n🎯 SİMÜLASYON RAPORU TAMAMLANDI!");
}