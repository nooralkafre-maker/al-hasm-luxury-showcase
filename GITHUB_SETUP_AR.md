# دليل رفع موقع AL HASM إلى GitHub Pages

هذه نسخة **معاينة عامة** من مشروع العقارات، وليست مشروع Laravel الحقيقي على استضافة PHP.

## طريقة الرفع
1. افتح https://github.com/new وأنشئ مستودعاً عاماً Public باسم `al-hasm-luxury-showcase` على حساب `nooralkafre-maker`.
2. فك ضغط حزمة المعاينة التي أرسلتها لك. افتح المجلد الناتج وانسخ/اسحب **جميع الملفات والمجلدات الموجودة بداخله** إلى خيار **Add file > Upload files** في GitHub. انتبه أن `index.html` يجب أن يكون في جذر المستودع، وليس داخل مجلد إضافي.
3. اختر **Commit changes**.
4. افتح **Settings > Pages** ثم **Build and deployment > Source: Deploy from a branch** واختر `main` والمجلد `/(root)` ثم اضغط **Save**.
5. عند اكتمال النشر سيكون رابط المعاينة بالشكل التالي:
   `https://nooralkafre-maker.github.io/al-hasm-luxury-showcase/`
6. رابط عرض نموذج لوحة التحكم (غير متصل بقاعدة البيانات):
   `https://nooralkafre-maker.github.io/al-hasm-luxury-showcase/admin.html`

> لا ترفع ملف Laravel الأصلي الذي يحتوي على `.env` أو قاعدة بيانات SQLite إلى مستودع عام. GitHub Pages لا يشغل PHP أو Laravel أو تسجيل الدخول للمدير.

للمعاينة على جهازك قبل النشر: افتح `index.html` في المتصفح، أو شغّل خادماً محلياً لعرض الصفحات والروابط بشكل أفضل.
