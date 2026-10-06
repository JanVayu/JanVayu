# নতুন ভূমিকা যোগ করা

`index.html`-এ `ROLE_CONFIG` জাভাস্ক্রিপ্ট অবজেক্টে রোল সিস্টেম কনফিগার করা থাকে।

---

## ধাপে ধাপে

### ১. ROLE_CONFIG-এ যোগ করুন

```javascript
const ROLE_CONFIG = {
    yourRole: {
        icon: '<span class="si si-icon-name"></span>',
        label: 'Role Display Name',
        heading: 'A short, compelling heading for the dashboard',
        description: 'One sentence about what this role gets.',
        actions: [
            {
                icon: '<span class="si si-icon"></span>',
                panel: 'panel-id',
                title: 'Action card title',
                desc: 'What the user will find.',
                cta: 'Action text'
            },
            // 3 actions total
        ],
        panels: [
            { panel: 'panel-id', title: 'Panel Name', desc: 'Short description' },
            // 6 recommended panels
        ]
    }
};
```

### ২. কোনো HTML পরিবর্তনের প্রয়োজন নেই

হেডারে থাকা রোল সুইচারটি `ROLE_CONFIG` থেকে `#rolePopoverGrid`-এ জেনারেট হয়, তাই সেখানে নতুন কি (key) স্বয়ংক্রিয়ভাবে চলে আসে। পুরোনো ফুল-স্ক্রিন রোল ওভারলে এবং এর `role-card` মার্কআপ এখন আর নেই।

### ৩. ট্রান্সলেশন কি (translation keys) যোগ করুন (ঐচ্ছিক)

`data-i18n` কি এবং ট্রান্সলেশন JSON-এ এর সংশ্লিষ্ট এন্ট্রিগুলো যোগ করুন।

---

## নির্দেশিকা

- **৩টি অ্যাকশন (actions)** — এই ভূমিকাটি সবচেয়ে বেশি প্রভাব ফেলতে পারে এমন ৩টি কাজ বেছে নিন
- **৬টি প্যানেল (panels)** — সবচেয়ে প্রাসঙ্গিক প্যানেলগুলো সুপারিশ করুন
- **হেডিং (Heading)** — এটি অ্যাকশনেবল এবং উৎসাহব্যঞ্জক হওয়া উচিত
- **বর্ণনা (Description)** — এক বাক্যের, সুনির্দিষ্ট, টুলস/ডেটার উল্লেখ থাকতে হবে
- **আইকন (Icon)** — [Sargam Icons](https://sargamicons.com/) থেকে বেছে নিন
