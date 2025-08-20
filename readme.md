
live link -> https://tour-organizer-server.vercel.app


















#### payment method way true and false
// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Complete -> Backend(localhost:5000/api/v1/payment/success) -> Update Payment(PAID) & Booking(CONFIRM) -> redirect to frontend -> Frontend(localhost:5173/payment/success)

// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Fail / Cancel -> Backend(localhost:5000) -> Update Payment(FAIL / CANCEL) & Booking(FAIL / CANCEL) -> redirect to frontend -> Frontend(localhost:5173/payment/cancel or localhost:5173/payment/fail)
#### Multer + multer-storage-cloudinary + Cloudinary 
```
১. ইউজার ফর্ম দিয়ে ছবি আপলোড করে (form-data)
      ⬇
২. Multer ফাইল নেয় এবং সরাসরি Cloudinary-তে আপলোড করে
      ⬇
৩. Cloudinary URL রিটার্ন করে → req.file এ সেই URL থাকে
      ⬇
৪. তুমি চাইলে সেই URL MongoDB-তে রেখে দিতে পারো
      ⬇
৫. কোনো সময় ছবি ডিলিট করতে চাইলে → সেই URL থেকে public_id বের করে Cloudinary থেকে ডিলিট করা যায়
```





