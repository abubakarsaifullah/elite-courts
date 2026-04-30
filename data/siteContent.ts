export const siteContent = {
  config: {
    name: "Elite Courts",
    shortName: "Elite Courts",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://elitecourts.com.pk",
    email: "elitecourtspadel@gmail.com",
    phoneDisplay: "0308 4708858",
    phoneHref: "tel:+923084708858",
    whatsappNumber: "923084708858",
    address: "Elite Courts, 23-A, P&D Cooperative Housing Society, Main Canal Road, Lahore",
    locationSummary:
      "Elite Courts brings padel, pickleball, cricket practice, badminton, table tennis, and useful player amenities together at one easy-to-access facility on Main Canal Road, Lahore.",
    primaryWhatsappMessage: "I'm looking to book a court at Elite Courts.",
  },

  navigation: [
    { href: "/", label: "Home" },
    { href: "/sports", label: "Sports" },
    { href: "/pricing", label: "Pricing" },
    { href: "/memberships", label: "Memberships" },
    { href: "/videos", label: "Videos" },
    { href: "/contact", label: "Contact" },
  ],

  seo: {
    defaultTitle: "Elite Courts Lahore | Padel, Pickleball, Cricket, Badminton and Table Tennis",
    defaultDescription:
      "Book padel, pickleball, cricket bowling machine, badminton, and table tennis at Elite Courts on Main Canal Road, Lahore. View prices, memberships, and WhatsApp booking details.",
    keywords: [
      "Elite Courts Lahore",
      "Padel court in Lahore",
      "Padel in Lahore",
      "Pickleball in Lahore",
      "Cricket bowling machine Lahore",
      "Cricket nets Lahore",
      "Badminton court Lahore",
      "Table tennis Lahore",
      "Sports facility Lahore",
      "Elite Courts pricing",
    ],
  },

  socialLinks: [
    {
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61583891281539",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/elite.courts/",
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/@Elite.courts",
    },
    {
      label: "TikTok",
      href: "https://tiktok.com/@elite.courts",
    },
  ],

  hero: {
    eyebrow: "Elite Sports Experience",
    title: "Premium courts and practice spaces in Lahore.",
    description:
      "Book padel, pickleball, cricket bowling machine practice, badminton, and table tennis at Elite Courts. Clear rates, clean facilities, and quick WhatsApp booking make it easy to plan your next session.",
    primaryButtonLabel: "Book a court",
    secondaryButtonLabel: "View pricing",
    supportingPoints: [
      "Padel, pickleball, cricket, badminton and table tennis",
      "Equipment and useful player amenities available",
      "Fast booking through WhatsApp",
    ],
    slides: [
      {
        id: "Padel-pic",
        src: "/images/slider/Padel-pic.JPG",
        alt: "Illustration of players on a pickleball court at Elite Courts Lahore",
        label: "Padel",
        caption: "Dedicated standard-sized courts for singles and doubles.",
      },
      {
        id: "Cricket-pic",
        src: "/images/slider/Cricket-pic.JPG",
        alt: "Illustration of the cricket bowling machine practice lane at Elite Courts Lahore",
        label: "Cricket Practice",
        caption: "Bowling machine, swing and spin options, and speeds up to 160 kph.",
      },
      {
        id: "Racket-court",
        src: "/images/slider/Racket-court.png",
        alt: "Racket court area at Elite Courts Lahore",
        label: "Racket Sports",
        caption: "Modern racket court space for high-energy sessions and training.",
      },
      {
        id: "Elitecourtspic",
        src: "/images/slider/Elitecourtspic.png",
        alt: "Elite Courts facility view in Lahore",
        label: "Facility",
        caption: "A premium multi-sport setup designed for comfort and performance.",
      },
      {
        id: "IMG_2097",
        src: "/images/slider/IMG_2097.PNG",
        alt: "Players practicing at Elite Courts Lahore",
        label: "Highlights",
        caption: "Live action moments from daily sessions at Elite Courts.",
      },
    ],
  },

  pages: {
    home: {
      sports: {
        eyebrow: "Sports offered",
        title: "Choose your game and get straight to the court.",
        description:
          "Every sport has its own simple section, so visitors can quickly understand what is available, what is included, and how to book.",
        actionLabel: "Explore all sports",
      },
      why: {
        eyebrow: "Why choose Elite Courts",
        title: "A clean, comfortable facility for serious practice and friendly games.",
        description:
          "Elite Courts is built around clear booking, quality playing areas, useful amenities, and an experience that feels easy from the first visit.",
      },
      pricing: {
        eyebrow: "Pricing highlights",
        title: "Clear rates before you book.",
        description:
          "The most requested starting prices are easy to scan on the homepage. The full pricing page gives you every current package, bundle, and membership.",
        actionLabel: "View all pricing",
      },
      memberships: {
        eyebrow: "Membership highlights",
        title: "Monthly options for regular players.",
        description:
          "Cricket Academy practice plans and racket-sports memberships are organized so frequent players can compare them without confusion.",
        actionLabel: "View memberships",
      },
      amenities: {
        eyebrow: "Amenities",
        title: "Small comforts that make every session easier.",
        description:
          "Players can use practical on-site amenities such as recording access, changing rooms, Wi-Fi, parking, refreshments, and clean bathrooms.",
      },
      location: {
        eyebrow: "Location",
        title: "Easy to find on Main Canal Road.",
        description:
          "The address, map, directions, phone, and WhatsApp options are placed together so visitors can plan their visit quickly.",
      },
      cta: {
        title: "Ready to book your next session?",
        description:
          "Send Elite Courts a quick WhatsApp message with your sport and preferred time, or visit the contact page for phone, email, and directions.",
      },
    },

    sports: {
      metadataTitle: "Sports at Elite Courts Lahore | Padel, Pickleball, Cricket, Badminton and Table Tennis",
      metadataDescription:
        "Explore the sports offered at Elite Courts Lahore, including padel, pickleball, cricket bowling machine practice, table tennis, and badminton.",
      hero: {
        eyebrow: "Sports",
        title: "Padel, pickleball, cricket practice, badminton, and table tennis in one place.",
        description:
          "Compare each sport, check what is included, and move to pricing or WhatsApp booking from the same card.",
      },
      section: {
        eyebrow: "All sports",
        title: "Built for competitive rallies, focused practice, and casual games.",
        description:
          "The facility information below keeps the current Elite Courts details clear, practical, and easy to understand on any screen size.",
      },
      cta: {
        title: "Not sure which slot or package to choose?",
        description:
          "Message Elite Courts on WhatsApp with your sport, number of players, and preferred timing, and the team can guide you to the right option.",
      },
    },

    pricing: {
      metadataTitle: "Elite Courts Pricing Lahore | Padel, Pickleball, Cricket and Indoor Sports Rates",
      metadataDescription:
        "View current Elite Courts prices for padel, pickleball, cricket bowling machine, table tennis, badminton, and monthly memberships in Lahore.",
      hero: {
        eyebrow: "Pricing",
        title: "Current packages and rates, organized for quick booking decisions.",
        description:
          "Every price is kept in one editable package file and displayed in clear cards with availability, savings, inclusions, and WhatsApp booking links.",
      },
      intro: {
        eyebrow: "Package categories",
        title: "Browse by sport or jump straight to the package you need.",
        description:
          "The pricing layout separates padel, pickleball, cricket, table tennis, badminton, and memberships so visitors do not have to hunt through a long mixed list.",
      },
      cta: {
        title: "Want a fast answer on availability?",
        description:
          "Open WhatsApp from any package card and your booking message will already include the package context.",
      },
    },

    memberships: {
      metadataTitle: "Elite Courts Memberships Lahore | Monthly Cricket and Racket Sports Plans",
      metadataDescription:
        "Compare Elite Courts monthly memberships for Cricket Academy daily practice, padel, and pickleball in Lahore.",
      hero: {
        eyebrow: "Memberships",
        title: "Monthly plans for players who visit often.",
        description:
          "Cricket daily practice memberships and racket-sports memberships are shown with clear limits, prices, perks, and direct inquiry buttons.",
      },
      section: {
        eyebrow: "Monthly plans",
        title: "Compare Cricket Academy and racket-sports memberships.",
        description:
          "The plan names, limits, prices, and listed perks are kept accurate and easy to update from the packages data file.",
      },
      cta: {
        title: "Interested in a recurring plan?",
        description:
          "Use the membership inquiry button to ask Elite Courts which plan best fits your playing frequency.",
      },
    },

    videos: {
      metadataTitle: "Elite Courts Videos | Sports Highlights and Facility Media",
      metadataDescription:
        "Watch Elite Courts videos and sports highlights for padel, pickleball, cricket practice, badminton, table tennis, and facility updates.",
      hero: {
        eyebrow: "Videos",
        title: "Highlights, facility clips, and match moments.",
        description:
          "Watch Elite Courts YouTube highlights in a responsive gallery, managed from one simple links array.",
      },
      section: {
        eyebrow: "Media gallery",
        title: "A simple video grid for future highlights.",
        description:
          "Use this page for padel rallies, cricket practice clips, pickleball games, facility tours, and other real Elite Courts media when available.",
      },
      emptyState: {
        title: "Videos will appear here soon.",
        description:
          "No public videos are configured yet. Add YouTube links to the array in data/videos.ts to publish them here.",
      },
    },

    contact: {
      metadataTitle: "Contact Elite Courts Lahore | WhatsApp, Phone, Email and Location",
      metadataDescription:
        "Contact Elite Courts in Lahore by WhatsApp, phone, email, contact form, or map directions. Find the address on Main Canal Road.",
      hero: {
        eyebrow: "Contact",
        title: "Call, message, or visit Elite Courts.",
        description:
          "Use WhatsApp for quick booking questions, call the facility, send a form message, or open directions to the courts on Main Canal Road.",
      },
      details: {
        eyebrow: "Get in touch",
        title: "Choose the contact method that is easiest for you.",
        description:
          "WhatsApp is usually the fastest way to ask about booking. Phone, email, and the form are available for general questions and longer messages.",
      },
      form: {
        eyebrow: "Contact form",
        title: "Send a direct message.",
        description:
          "Use the form for booking questions, membership inquiries, facility details, or partnership conversations.",
      },
      location: {
        eyebrow: "Location",
        title: "Map, address, and directions in one place.",
        description:
          "Open the map, get directions, or call before your visit from the same section.",
      },
    },
  },

  forms: {
    contact: {
      labels: {
        name: "Name",
        email: "Email",
        phone: "Phone",
        subject: "Subject",
        message: "Message",
        submit: "Send message",
        submitting: "Sending...",
      },
      placeholders: {
        name: "Your full name",
        email: "you@example.com",
        phone: "0308 4708858",
        subject: "Booking inquiry, membership, event, or general question",
        message: "Tell us what you want to book or ask.",
      },
      defaultStatus: "Your message is sent securely to the Elite Courts team when email is configured.",
      successFallback: "Thanks. Your message has been sent successfully.",
      errorFallback: "Something went wrong. Please try again or message Elite Courts on WhatsApp.",
    },
  },

  reasonsToChoose: [
    {
      title: "Premium playing spaces",
      description:
        "The facility brings together panoramic padel courts, dedicated pickleball, cricket bowling machine practice, badminton, and table tennis in a clean, organized setting.",
    },
    {
      title: "Straightforward booking",
      description:
        "Pricing, packages, contact details, and WhatsApp actions are kept close to each sport so visitors can move from browsing to booking with less effort.",
    },
    {
      title: "Useful player amenities",
      description:
        "GoPro recording, changing rooms, Wi-Fi, parking, clean bathrooms, refreshments, and board games help make each visit more comfortable.",
    },
  ],

  sports: [
    {
      slug: "padel",
      name: "Padel Courts",
      shortName: "Padel",
      summary:
        "Play on state-of-the-art panoramic glass courts with WPT-certified blue turf, clear visibility, and a consistent bounce for competitive games.",
      features: [
        "Panoramic glass courts",
        "WPT-certified blue turf",
        "Clear visibility across the court",
        "Consistent bounce for competitive play",
      ],
      image: "/images/sports/padel.svg",
      bookingMessage: "I'm looking to book a Padel court at Elite Courts.",
    },
    {
      slug: "pickleball",
      name: "Pickleball Setup",
      shortName: "Pickleball",
      summary:
        "Enjoy dedicated standard-sized pickleball courts with quality netting and non-slip surfaces for singles or doubles matches.",
      features: [
        "Standard-sized dedicated courts",
        "High-quality netting",
        "Non-slip playing surface",
        "Suitable for singles and doubles",
      ],
      image: "/images/sports/pickleball.svg",
      bookingMessage: "I'm looking to book a Pickleball slot at Elite Courts.",
    },
    {
      slug: "cricket",
      name: "Cricket Nets / Bowling Machine",
      shortName: "Cricket",
      summary:
        "Train in a well-lit cricket practice lane with a speed gun, bowling machine, swing and spin options, and adjustable speed up to 160 kph.",
      features: [
        "Premium lighting cricket practice lane",
        "Speed gun",
        "Bowling machine with swing and spin options",
        "Adjustable speed up to 160 kph",
      ],
      image: "/images/sports/cricket.svg",
      bookingMessage: "I'm looking to book Cricket bowling machine practice at Elite Courts.",
    },
    {
      slug: "table-tennis",
      name: "Table Tennis",
      shortName: "Table Tennis",
      summary:
        "Play indoor table tennis with proper lighting, quality rackets, and balls for focused practice or quick competitive games.",
      features: ["Indoor table tennis facility", "Proper lighting", "Quality rackets", "Quality balls"],
      image: "/images/sports/table-tennis.svg",
      bookingMessage: "I'm looking to book Table Tennis at Elite Courts.",
    },
    {
      slug: "badminton",
      name: "Badminton Court",
      shortName: "Badminton",
      summary:
        "Book a standard-sized badminton court with premium lighting, quality rackets, and shuttles for comfortable play.",
      features: ["Standard-sized badminton court", "Premium lighting", "Quality rackets", "Quality shuttles"],
      image: "/images/sports/badminton.svg",
      bookingMessage: "I'm looking to book Badminton at Elite Courts.",
    },
  ],

  amenities: [
    {
      title: "GoPro recording",
      description: "Record your session where recording access is available.",
      icon: "camera",
    },
    {
      title: "Changing rooms",
      description: "A convenient place to prepare before and after play.",
      icon: "sparkles",
    },
    {
      title: "High-speed Wi-Fi",
      description: "Stay connected while you are at the facility.",
      icon: "wifi",
    },
    {
      title: "Clean bathrooms",
      description: "A simple but important comfort for every visit.",
      icon: "sparkles",
    },
    {
      title: "Ample free parking",
      description: "Easier arrival for players and guests.",
      icon: "parking",
    },
    {
      title: "Coffee shop",
      description: "Drinks and snacks are available on site.",
      icon: "coffee",
    },
    {
      title: "Board games",
      description: "Extra facility access where applicable.",
      icon: "gamepad",
    },
  ],

  location: {
    mapTitle: "Elite Courts map",
    directionsLabel: "Get directions",
    callLabel: "Call now",
    visitTitle: "Visit our courts",
  },

  footer: {
    quickLinksTitle: "Quick links",
    connectTitle: "Connect",
    copyrightPrefix: "Copyright",
    rightsText: "All rights reserved.",
  },

  legal: {
    privacyPolicy: {
      metadataTitle: "Privacy Policy | Elite Courts",
      metadataDescription:
        "Read the Elite Courts Privacy Policy for contact forms, WhatsApp communication, cookies, and website data handling.",
      effectiveDate: "April 27, 2026",
      hero: {
        eyebrow: "Privacy Policy",
        title: "How Elite Courts handles website inquiries and contact details.",
        description:
          "This policy explains what information may be collected when you use the Elite Courts website or contact the business online.",
      },
      sections: [
        {
          title: "Overview",
          paragraphs: [
            "Elite Courts respects visitor privacy and aims to collect only the information needed to respond to inquiries, support booking conversations, and operate the website safely.",
            "This Privacy Policy applies to the Elite Courts website and related digital communications. It should be reviewed if new booking tools, payment systems, analytics platforms, or third-party services are added later.",
          ],
        },
        {
          title: "Information you may provide",
          paragraphs: [
            "When you contact Elite Courts through the website, email, WhatsApp, phone, or social media, you may provide your name, email address, phone number, preferred sport, package interest, and message details.",
            "Please avoid sending sensitive personal, financial, or confidential information unless it is necessary for your request.",
          ],
        },
        {
          title: "Technical information",
          paragraphs: [
            "The website may receive basic technical information such as browser type, device information, IP address, referral source, and server logs needed for security, performance, and troubleshooting.",
            "If analytics or cookies are enabled, they may help Elite Courts understand page views, device behavior, and general website usage.",
          ],
        },
        {
          title: "How information is used",
          paragraphs: [
            "Elite Courts may use submitted information to respond to inquiries, discuss bookings, answer membership questions, improve the website, monitor spam, and maintain secure operations.",
            "Operational messages related to your inquiry may be sent through the contact method you used or provided.",
          ],
        },
        {
          title: "WhatsApp and third-party platforms",
          paragraphs: [
            "When you contact Elite Courts through WhatsApp, Google Maps, social media, or other third-party platforms, those platforms may process your information under their own policies.",
            "Elite Courts does not control the data practices of third-party services linked from the website.",
          ],
        },
        {
          title: "Sharing information",
          paragraphs: [
            "Information may be shared only when reasonably necessary to operate website and communication services, such as with hosting providers, email delivery providers, analytics tools, map providers, or support vendors.",
            "Information may also be disclosed when required to protect rights, investigate misuse, respond to lawful requests, or maintain business and website security.",
          ],
        },
        {
          title: "Security and retention",
          paragraphs: [
            "Elite Courts takes reasonable steps to protect inquiry information, but no website, email system, or online communication channel can be guaranteed to be completely secure.",
            "Inquiry records are kept only for as long as reasonably needed for customer service, follow-up, internal reference, security, or administrative purposes.",
          ],
        },
        {
          title: "Your choices",
          paragraphs: [
            "You may contact Elite Courts to ask about correction or deletion of information you previously provided, subject to legitimate business, security, legal, or recordkeeping needs.",
            "You can usually manage cookies and similar technologies through your browser settings.",
          ],
        },
        {
          title: "Updates to this policy",
          paragraphs: [
            "Elite Courts may update this Privacy Policy when website features, operations, or legal requirements change. The latest version will be posted on this page with an updated effective date.",
          ],
        },
        {
          title: "Contact for privacy questions",
          paragraphs: [
            "For privacy-related questions, contact Elite Courts at elitecourtspadel@gmail.com, call 0308 4708858, or write to Elite Courts, 23-A, P&D Cooperative Housing Society, Main Canal Road, Lahore.",
          ],
        },
      ],
    },

    termsOfUse: {
      metadataTitle: "Terms of Use | Elite Courts",
      metadataDescription:
        "Read the Elite Courts Terms of Use for website access, booking expectations, acceptable use, and published service information.",
      effectiveDate: "April 27, 2026",
      hero: {
        eyebrow: "Terms of Use",
        title: "Clear terms for using the Elite Courts website.",
        description:
          "These terms explain how visitors may use the website and how booking-related information should be understood.",
      },
      sections: [
        {
          title: "Acceptance of these terms",
          paragraphs: [
            "By accessing or using the Elite Courts website, you agree to these Terms of Use. If you do not agree, please do not use the website.",
            "These Terms apply to website use. In-person bookings, facility rules, waivers, coaching arrangements, or separate commercial terms may be communicated separately by Elite Courts.",
          ],
        },
        {
          title: "Website purpose",
          paragraphs: [
            "The website presents information about Elite Courts, including sports offerings, prices, memberships, contact details, media, and booking options.",
            "Website content does not guarantee availability or confirm a reservation unless Elite Courts separately confirms the booking.",
          ],
        },
        {
          title: "Information accuracy",
          paragraphs: [
            "Elite Courts aims to keep information clear and current. However, prices, promotions, schedules, availability, facilities, and membership details may change when business needs require it.",
            "If there is any uncertainty, contact Elite Courts directly before visiting or making plans around a booking.",
          ],
        },
        {
          title: "Bookings and communications",
          paragraphs: [
            "Booking buttons may open WhatsApp or another contact channel. A booking request becomes confirmed only after Elite Courts confirms it directly.",
            "You agree to provide accurate contact details and not to submit misleading, abusive, automated, or spam messages.",
          ],
        },
        {
          title: "Acceptable use",
          paragraphs: [
            "You may use the website only for lawful purposes and in a way that does not harm the website, the business, other visitors, or third-party services.",
            "You must not attempt unauthorized access, interfere with site functionality, scrape at scale, distribute malicious code, or use the site for harassment or spam.",
          ],
        },
        {
          title: "Intellectual property",
          paragraphs: [
            "Unless otherwise stated, the website design, branding, text, graphics, layout, and original content are owned by or used with permission by Elite Courts.",
            "You may view and share public page links for personal use, but you may not copy, republish, or commercially exploit website materials without permission.",
          ],
        },
        {
          title: "Third-party services",
          paragraphs: [
            "The website may link to WhatsApp, Google Maps, social media platforms, or other external services. Elite Courts does not control third-party content, policies, availability, or security.",
          ],
        },
        {
          title: "No website warranty",
          paragraphs: [
            "The website is provided on an as-available basis. Elite Courts does not guarantee uninterrupted access, error-free operation, or that every detail will be complete for every visitor's situation.",
          ],
        },
        {
          title: "Limitation of liability",
          paragraphs: [
            "To the fullest extent permitted by applicable law, Elite Courts will not be liable for indirect, incidental, special, consequential, or punitive damages arising from website use, reliance on website information, or third-party service interactions.",
            "Nothing in these Terms is intended to exclude liability where exclusion is not permitted under applicable law.",
          ],
        },
        {
          title: "Updates to these terms",
          paragraphs: [
            "Elite Courts may update these Terms when website features, operations, or legal requirements change. The updated version will be posted on this page with a revised effective date.",
          ],
        },
        {
          title: "Contact information",
          paragraphs: [
            "For questions about these Terms or website use, contact Elite Courts at elitecourtspadel@gmail.com, call 0308 4708858, or write to Elite Courts, 23-A, P&D Cooperative Housing Society, Main Canal Road, Lahore.",
          ],
        },
      ],
    },
  },
} as const;

export const siteConfig = {
  ...siteContent.config,
  socialLinks: siteContent.socialLinks,
} as const;

export const navigation = siteContent.navigation;
export const heroSlides = siteContent.hero.slides;
export const amenities = siteContent.amenities;
export const reasonsToChoose = siteContent.reasonsToChoose;
export const sports = siteContent.sports;
export const pageContent = siteContent.pages;
export const legalContent = siteContent.legal;

export function buildWhatsAppUrl(message: string) {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  const query = new URLSearchParams({ text: message });
  return `${base}?${query.toString()}`;
}
