// 🌐 NetGuard by PLGames - Configuration
// DNS без компромиссов: быстро, безопасно, без ограничений
// IMPORTANT: For FREE version: IS_VIP = false, API_KEY = 'free_tier_secret_v1'
// IMPORTANT: For VIP version:  IS_VIP = true,  API_KEY = 'vip_super_secret_key'

const CONFIG = {
  // BRAND
  APP_NAME: 'NetGuard',
  BRAND: 'PLGames',
  TAGLINE: 'DNS без компромиссов',
  
  // VERSION CONTROL
  IS_VIP: false,
  API_KEY: 'free_tier_secret_v1',
  
  // ПУБЛИЧНЫЕ DNS С ШИФРОВАНИЕМ (доступны всем в FREE версии)
  PUBLIC_DNS: [
    {
      id: 'cloudflare',
      name: 'Cloudflare DNS',
      icon: '🟦',
      description: {
        en: 'Fast, private, no logging',
        ru: 'Быстрая, приватная, без логирования'
      },
      protocols: {
        doh: {
          url: 'https://cloudflare-dns.com/dns-query',
          name: 'DNS-over-HTTPS',
          platforms: ['Windows', 'Browsers', 'iOS', 'Android']
        },
        dot: {
          hostname: 'cloudflare-dns.com',
          name: 'DNS-over-TLS',
          platforms: ['Android', 'Linux', 'iOS']
        },
        doq: {
          url: 'quic://cloudflare-dns.com',
          name: 'DNS-over-QUIC',
          platforms: ['Linux', 'Custom']
        },
        ip: '1.1.1.1'
      },
      features: {
        en: ['Privacy focused', 'Fast worldwide', 'Free forever', 'All protocols'],
        ru: ['Фокус на приватности', 'Быстрая во всём мире', 'Бесплатно навсегда', 'Все протоколы']
      }
    },
    {
      id: 'adguard',
      name: 'AdGuard DNS',
      icon: '🟩',
      description: {
        en: 'Blocks ads, trackers, phishing',
        ru: 'Блокирует рекламу, трекеры, фишинг'
      },
      protocols: {
        doh: {
          url: 'https://dns.adguard-dns.com/dns-query',
          name: 'DNS-over-HTTPS',
          platforms: ['Windows', 'Browsers', 'iOS', 'Android']
        },
        dot: {
          hostname: 'dns.adguard-dns.com',
          name: 'DNS-over-TLS',
          platforms: ['Android', 'Linux', 'iOS']
        },
        doq: {
          url: 'quic://dns.adguard-dns.com',
          name: 'DNS-over-QUIC',
          platforms: ['Linux', 'Custom']
        },
        ip: '94.140.14.14'
      },
      features: {
        en: ['Ad blocking', 'Malware protection', 'No logging', 'Family filter available'],
        ru: ['Блокировка рекламы', 'Защита от малвари', 'Без логов', 'Семейный фильтр']
      }
    },
    {
      id: 'quad9',
      name: 'Quad9 DNS',
      icon: '🟪',
      description: {
        en: 'Security & privacy focused',
        ru: 'Безопасность и приватность'
      },
      protocols: {
        doh: {
          url: 'https://dns.quad9.net/dns-query',
          name: 'DNS-over-HTTPS',
          platforms: ['Windows', 'Browsers', 'iOS', 'Android']
        },
        dot: {
          hostname: 'dns.quad9.net',
          name: 'DNS-over-TLS',
          platforms: ['Android', 'Linux', 'iOS']
        },
        ip: '9.9.9.9'
      },
      features: {
        en: ['Malware blocking', 'DNSSEC validation', 'Privacy protection', 'Non-profit'],
        ru: ['Блокировка малвари', 'Валидация DNSSEC', 'Защита приватности', 'Некоммерческий']
      }
    },
    {
      id: 'google',
      name: 'Google Public DNS',
      icon: '🔵',
      description: {
        en: 'Reliable, fast, global',
        ru: 'Надёжная, быстрая, глобальная'
      },
      protocols: {
        doh: {
          url: 'https://dns.google/dns-query',
          name: 'DNS-over-HTTPS',
          platforms: ['Windows', 'Browsers', 'iOS', 'Android']
        },
        dot: {
          hostname: 'dns.google',
          name: 'DNS-over-TLS',
          platforms: ['Android', 'Linux', 'iOS']
        },
        ip: '8.8.8.8'
      },
      features: {
        en: ['High reliability', 'Fast resolution', 'Global coverage', 'DNSSEC'],
        ru: ['Высокая надёжность', 'Быстрое резолвирование', 'Глобальное покрытие', 'DNSSEC']
      }
    },
    {
      id: 'nextdns',
      name: 'NextDNS',
      icon: '🟨',
      description: {
        en: 'Customizable, privacy-first',
        ru: 'Настраиваемая, приватная'
      },
      protocols: {
        doh: {
          url: 'https://dns.nextdns.io',
          name: 'DNS-over-HTTPS',
          platforms: ['Windows', 'Browsers', 'iOS', 'Android', 'Routers']
        },
        dot: {
          hostname: 'dns.nextdns.io',
          name: 'DNS-over-TLS',
          platforms: ['Android', 'Linux', 'iOS']
        },
        doq: {
          url: 'quic://dns.nextdns.io',
          name: 'DNS-over-QUIC',
          platforms: ['Linux', 'Custom']
        },
        ip: '45.90.28.0'
      },
      features: {
        en: ['Customizable filtering', 'Analytics', 'Parental controls', 'Free tier'],
        ru: ['Настройка фильтров', 'Аналитика', 'Родительский контроль', 'Бесплатно']
      }
    },
    {
      id: 'cleanbrowsing',
      name: 'CleanBrowsing',
      icon: '🔷',
      description: {
        en: 'Family-friendly filtering',
        ru: 'Семейная фильтрация'
      },
      protocols: {
        doh: {
          url: 'https://doh.cleanbrowsing.org/doh/family-filter/',
          name: 'DNS-over-HTTPS',
          platforms: ['Windows', 'Browsers', 'iOS', 'Android']
        },
        dot: {
          hostname: 'family-filter-dns.cleanbrowsing.org',
          name: 'DNS-over-TLS',
          platforms: ['Android', 'Linux', 'iOS']
        },
        ip: '185.228.168.168'
      },
      features: {
        en: ['Adult content filter', 'Family protection', 'Malware blocking', 'Free tier'],
        ru: ['Фильтр взрослого контента', 'Семейная защита', 'Блокировка малвари', 'Бесплатно']
      }
    },
    {
      id: 'controld',
      name: 'Control D',
      icon: '🟧',
      description: {
        en: 'Programmable DNS',
        ru: 'Программируемый DNS'
      },
      protocols: {
        doh: {
          url: 'https://freedns.controld.com/p0',
          name: 'DNS-over-HTTPS',
          platforms: ['Windows', 'Browsers', 'iOS', 'Android', 'Routers']
        },
        dot: {
          hostname: 'p0.freedns.controld.com',
          name: 'DNS-over-TLS',
          platforms: ['Android', 'Linux', 'iOS']
        },
        doq: {
          url: 'quic://p0.freedns.controld.com',
          name: 'DNS-over-QUIC',
          platforms: ['Linux', 'Custom']
        },
        ip: '76.76.2.0'
      },
      features: {
        en: ['Custom rules', 'Ad blocking', 'Analytics', 'Zero logging'],
        ru: ['Свои правила', 'Блокировка рекламы', 'Аналитика', 'Без логирования']
      }
    },
    {
      id: 'opendns',
      name: 'OpenDNS',
      icon: '🔶',
      description: {
        en: 'Cisco security & filtering',
        ru: 'Безопасность и фильтрация Cisco'
      },
      protocols: {
        doh: {
          url: 'https://doh.opendns.com/dns-query',
          name: 'DNS-over-HTTPS',
          platforms: ['Windows', 'Browsers', 'iOS', 'Android']
        },
        ip: '208.67.222.222'
      },
      features: {
        en: ['Content filtering', 'Phishing protection', 'Customizable', 'Free tier'],
        ru: ['Фильтрация контента', 'Защита от фишинга', 'Настраиваемая', 'Бесплатно']
      }
    },
    {
      id: 'mullvad',
      name: 'Mullvad DNS',
      icon: '🟫',
      description: {
        en: 'Privacy-first, no logging',
        ru: 'Приватность превыше всего, без логов'
      },
      protocols: {
        doh: {
          url: 'https://dns.mullvad.net/dns-query',
          name: 'DNS-over-HTTPS',
          platforms: ['Windows', 'Browsers', 'iOS', 'Android']
        },
        dot: {
          hostname: 'dns.mullvad.net',
          name: 'DNS-over-TLS',
          platforms: ['Android', 'Linux', 'iOS']
        },
        ip: '194.242.2.2'
      },
      features: {
        en: ['Zero logging', 'No DNSSEC manipulation', 'Privacy-focused', 'Free'],
        ru: ['Никаких логов', 'Без манипуляций DNSSEC', 'Фокус на приватности', 'Бесплатно']
      }
    },
    {
      id: 'dnssb',
      name: 'DNS.SB',
      icon: '🟩',
      description: {
        en: 'German DNS, DNSSEC, no logging',
        ru: 'Немецкий DNS, DNSSEC, без логов'
      },
      protocols: {
        doh: {
          url: 'https://doh.dns.sb/dns-query',
          name: 'DNS-over-HTTPS',
          platforms: ['Windows', 'Browsers', 'iOS', 'Android']
        },
        dot: {
          hostname: 'dot.dns.sb',
          name: 'DNS-over-TLS',
          platforms: ['Android', 'Linux', 'iOS']
        },
        doq: {
          url: 'quic://dns.sb',
          name: 'DNS-over-QUIC',
          platforms: ['Linux', 'Custom']
        },
        ip: '185.222.222.222'
      },
      features: {
        en: ['Germany-based', 'DNSSEC validation', 'No censorship', 'Free'],
        ru: ['Базируется в Германии', 'Валидация DNSSEC', 'Без цензуры', 'Бесплатно']
      }
    },
    {
      id: 'libredns',
      name: 'LibreDNS',
      icon: '🔵',
      description: {
        en: 'Open-source, no logging',
        ru: 'Открытый исходный код, без логов'
      },
      protocols: {
        doh: {
          url: 'https://doh.libredns.gr/dns-query',
          name: 'DNS-over-HTTPS',
          platforms: ['Windows', 'Browsers', 'iOS', 'Android']
        },
        dot: {
          hostname: 'dot.libredns.gr',
          name: 'DNS-over-TLS',
          platforms: ['Android', 'Linux', 'iOS']
        },
        ip: '116.202.176.26'
      },
      features: {
        en: ['Open-source', 'No logging', 'Ad blocking option', 'Free'],
        ru: ['Открытый код', 'Без логирования', 'Опция блокировки рекламы', 'Бесплатно']
      }
    },
    {
      id: 'comss',
      name: 'Comss.one DNS',
      icon: '🌐',
      description: {
        en: 'SmartDNS with AI access, geo-blocking bypass',
        ru: 'SmartDNS с доступом к AI, обход блокировок'
      },
      protocols: {
        doh: {
          url: 'https://dns.comss.one/dns-query',
          name: 'DNS-over-HTTPS',
          platforms: ['Windows', 'Browsers', 'iOS', 'Android', 'Routers']
        },
        dot: {
          hostname: 'dns.comss.one',
          name: 'DNS-over-TLS',
          platforms: ['Android', 'Linux', 'iOS']
        },
        doq: {
          url: 'quic://dns.comss.one',
          name: 'DNS-over-QUIC',
          platforms: ['Linux', 'Custom']
        },
        ip: '195.133.25.16'
      },
      features: {
        en: ['SmartDNS', 'AI services access', 'Anti-phishing', 'Geo-bypass'],
        ru: ['SmartDNS', 'Доступ к AI сервисам', 'Защита от фишинга', 'Обход блокировок']
      }
    },
    {
      id: 'xboxdns',
      name: 'Xbox-DNS.ru',
      icon: '🎮',
      description: {
        en: 'Gaming-optimized DNS for Russia',
        ru: 'DNS для игр, оптимизирован для России'
      },
      protocols: {
        doh: {
          url: 'https://xbox-dns.ru/dns-query',
          name: 'DNS-over-HTTPS',
          platforms: ['Windows', 'Browsers', 'Xbox', 'PlayStation']
        },
        dot: {
          hostname: 'xbox-dns.ru',
          name: 'DNS-over-TLS',
          platforms: ['Android', 'Linux', 'iOS']
        },
        ip: '176.99.11.77'
      },
      features: {
        en: ['Gaming optimized', 'Low latency', 'Russia-based', 'Free'],
        ru: ['Оптимизирован для игр', 'Низкая задержка', 'Российский', 'Бесплатно']
      }
    },
    {
      id: 'wikimedia',
      name: 'Wikimedia DNS',
      icon: 'Ⓦ',
      description: {
        en: 'Wikimedia Foundation DNS service',
        ru: 'DNS сервис фонда Wikimedia'
      },
      protocols: {
        doh: {
          url: 'https://wikimedia-dns.org/dns-query',
          name: 'DNS-over-HTTPS',
          platforms: ['Windows', 'Browsers', 'iOS', 'Android']
        },
        dot: {
          hostname: 'wikimedia-dns.org',
          name: 'DNS-over-TLS',
          platforms: ['Android', 'Linux', 'iOS']
        },
        ip: '185.71.138.138'
      },
      features: {
        en: ['No filtering', 'QNAME minimization', 'DNSSEC enforced', 'Free'],
        ru: ['Без фильтрации', 'Минимизация QNAME', 'DNSSEC обязателен', 'Бесплатно']
      }
    },
    {
      id: 'alidns',
      name: 'AliDNS',
      icon: '🟠',
      description: {
        en: 'Alibaba Cloud DNS, fast in Asia',
        ru: 'DNS Alibaba Cloud, быстрый в Азии'
      },
      protocols: {
        doh: {
          url: 'https://dns.alidns.com/dns-query',
          name: 'DNS-over-HTTPS',
          platforms: ['Windows', 'Browsers', 'iOS', 'Android']
        },
        dot: {
          hostname: 'dns.alidns.com',
          name: 'DNS-over-TLS',
          platforms: ['Android', 'Linux', 'iOS']
        },
        doq: {
          url: 'quic://dns.alidns.com',
          name: 'DNS-over-QUIC',
          platforms: ['Linux', 'Custom']
        },
        ip: '223.5.5.5'
      },
      features: {
        en: ['Fast in China/Asia', 'IPv6 support', 'DNSSEC', 'Free'],
        ru: ['Быстрый в Китае/Азии', 'Поддержка IPv6', 'DNSSEC', 'Бесплатно']
      }
    },
    {
      id: 'cira',
      name: 'CIRA Canadian Shield',
      icon: '🍁',
      description: {
        en: 'Canadian DNS with privacy & malware protection',
        ru: 'Канадский DNS с приватностью и защитой'
      },
      protocols: {
        doh: {
          url: 'https://protected.canadianshield.cira.ca/dns-query',
          name: 'DNS-over-HTTPS',
          platforms: ['Windows', 'Browsers', 'iOS', 'Android']
        },
        dot: {
          hostname: 'protected.canadianshield.cira.ca',
          name: 'DNS-over-TLS',
          platforms: ['Android', 'Linux', 'iOS']
        },
        ip: '149.112.121.20'
      },
      features: {
        en: ['Malware blocking', 'Canadian traffic', 'DNSSEC', 'Family filter'],
        ru: ['Блокировка малвари', 'Канадский трафик', 'DNSSEC', 'Семейный фильтр']
      }
    }
  ],
  
  // ИНСТРУМЕНТЫ (доступность зависит от IS_VIP)
  TOOLS: {
    password_gen: {
      id: 'password_gen',
      name: { en: 'Password Generator', ru: 'Генератор паролей' },
      icon: '🔐',
      description: { 
        en: 'Generate secure random passwords',
        ru: 'Генерация безопасных паролей'
      },
      free_limit: 1, // 1 раз в неделю
      premium_limit: 5, // 5 раз в день
      available_free: true
    },
    ip_check: {
      id: 'ip_check',
      name: { en: 'Check IP Address', ru: 'Проверка IP адреса' },
      icon: '🌐',
      description: {
        en: 'Show your current IP, region, provider',
        ru: 'Показать ваш IP, регион, провайдер'
      },
      free_limit: 10,
      premium_limit: -1, // unlimited
      available_free: true
    },
    dns_check: {
      id: 'dns_check',
      name: { en: 'DNS Resolver Check', ru: 'Проверка DNS резолвера' },
      icon: '🔍',
      description: {
        en: 'Which DNS you are currently using',
        ru: 'Какой DNS сейчас используется'
      },
      free_limit: 10,
      premium_limit: -1,
      available_free: true
    },
    ssl_check: {
      id: 'ssl_check',
      name: { en: 'SSL Certificate Check', ru: 'Проверка SSL сертификата' },
      icon: '🔒',
      description: {
        en: 'Check SSL certificate info',
        ru: 'Проверка информации о сертификате'
      },
      free_limit: 5,
      premium_limit: -1,
      available_free: true
    },
    vpn_gen: {
      id: 'vpn_gen',
      name: { en: 'VPN Profile Generator', ru: 'Генератор VPN профилей' },
      icon: '🔑',
      description: {
        en: 'Create OpenVPN/WireGuard configs',
        ru: 'Создание конфигов OpenVPN/WireGuard'
      },
      free_limit: 0,
      premium_limit: 5,
      available_free: false
    },
    wireguard_gen: {
      id: 'wireguard_gen',
      name: { en: 'WireGuard Keys', ru: 'WireGuard ключи' },
      icon: '⚡',
      description: {
        en: 'Generate WireGuard key pairs',
        ru: 'Генерация пары ключей WireGuard'
      },
      free_limit: 0,
      premium_limit: 5,
      available_free: false
    },
    ssh_gen: {
      id: 'ssh_gen',
      name: { en: 'SSH Keys', ru: 'SSH ключи' },
      icon: '🗝️',
      description: {
        en: 'Generate RSA 4096 SSH keys',
        ru: 'Генерация RSA 4096 SSH ключей'
      },
      free_limit: 0,
      premium_limit: 3,
      available_free: false
    },
    proxy_list: {
      id: 'proxy_list',
      name: { en: 'Proxy Lists', ru: 'Списки прокси' },
      icon: '📋',
      description: {
        en: 'Working SOCKS5/HTTP proxies',
        ru: 'Рабочие прокси SOCKS5/HTTP'
      },
      free_limit: 0,
      premium_limit: -1,
      available_free: false
    }
  },
  
  // Server configuration
  SERVERS: [
    {
      id: 'free_pool',
      name: {
        en: '🌍 Free DNS (auto)',
        ru: '🌍 Бесплатный DNS (авто)'
      },
      url: '',
      badge: 'FREE',
      badgeColor: '#2196F3',
      description: {
        en: '16 public DoH/DoT providers with auto failover',
        ru: '16 публичных DoH/DoT провайдеров с авто-переключением'
      },
      vip_only: false,
      flag: '🌐'
    },
    {
      id: 'vip_auto',
      name: {
        en: '👑 VIP (auto)',
        ru: '👑 VIP (авто)'
      },
      url: '',
      badge: 'VIP',
      badgeColor: '#FFD700',
      description: {
        en: 'Automatic VIP endpoint selection',
        ru: 'Автоподбор VIP точки'
      },
      vip_only: true,
      flag: '⭐'
    }
  ],

  VIP_POOL: [
    {
      id: 'vip_de',
      name: { en: 'VIP Germany', ru: 'VIP Германия' },
      url: 'https://vip-de.dnsshield.pro:9443',
      flag: '🇩🇪'
    },
    {
      id: 'vip_fr',
      name: { en: 'VIP France', ru: 'VIP Франция' },
      url: 'https://vip-fr.dnsshield.pro:9443',
      flag: '🇫🇷'
    },
    {
      id: 'vip_pl',
      name: { en: 'VIP Poland', ru: 'VIP Польша' },
      url: 'https://vip-pl.dnsshield.pro:9443',
      flag: '🇵🇱'
    }
  ],

  // Default settings
  DEFAULT_LANG: 'en',
  DEFAULT_SERVER: 'free_pool',
  
  // Donation addresses
  DONATION: {
    USDT_TRC20: 'TXxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    BTC: 'bc1qxxxxxxxxxxxxxxxxxxxxxxxxx',
    PAYPAL: 'https://paypal.me/yourlink',
    CARD_RU: '2200 xxxx xxxx xxxx',
    TELEGRAM: 'https://t.me/your_support_bot'
  },
  
  // VIP Benefits
  VIP_BENEFITS: {
    en: [
      '✅ Access to 3 premium servers (DE/FR/PL)',
      '✅ Priority speed',
      '✅ No limits',
      '✅ Future features (ad blocking, fallback DNS)'
    ],
    ru: [
      '✅ Доступ к 3 премиум серверам (DE/FR/PL)',
      '✅ Приоритетная скорость',
      '✅ Без ограничений',
      '✅ Будущие функции (блокировка рекламы, fallback DNS)'
    ]
  },
  
  // Pricing
  VIP_PRICING: {
    en: {
      monthly: '$3.99/month',
      yearly: '$39.99/year',
      lifetime: '$99 lifetime'
    },
    ru: {
      monthly: '$3.99/месяц',
      yearly: '$39.99/год',
      lifetime: '$99 навсегда'
    }
  }
};

// Translations
const TRANSLATIONS = {
  en: {
    appTitle: 'DNS Shield Pro',
    version: 'v1.0.0',
    free: 'FREE',
    vip: '👑 VIP',
    
    // Status & Connection
    connected: 'Connected',
    disconnected: 'Disconnected',
    connecting: 'Connecting...',
    connect: 'CONNECT',
    disconnect: 'DISCONNECT',
    online: 'Online',
    offline: 'Offline',
    
    // Servers
    selectServer: 'Select Server:',
    serverSelection: 'Server Selection',
    vipOnly: 'VIP Only',
    vipRequired: 'VIP subscription required',
    upgradeToVip: 'Upgrade to VIP',
    
    // Buttons
    testConnection: '🧪 Test Connection',
    testing: 'Testing...',
    donate: '❤️ Support Project',
    settingsBtn: 'Settings',
    donateBtn: 'Support / VIP',
    
    // Stats
    statsTitle: 'Statistics (Today)',
    queriesCount: 'Queries:',
    blockedCount: 'Blocked:',
    dataSaved: 'Saved:',
    
    // Status Messages
    connectionSuccess: 'Connection successful!',
    connectionFailed: 'Connection failed!',
    noServerAvailable: 'No servers available',
    
    // Donation Modal
    donateTitle: '❤️ Support DNS Shield Pro',
    donateDesc: 'Become a VIP user and get access to all premium servers!',
    vipBenefit1: 'Access to VIP pool (DE/FR/PL)',
    vipBenefit2: 'Priority speed',
    vipBenefit3: 'No limits',
    vipBenefits: 'VIP Benefits:',
    pricing: 'Pricing:',
    paymentMethods: 'Payment Methods:',
    cryptoUSDT: 'Crypto (USDT TRC-20)',
    cryptoBTC: 'Crypto (BTC)',
    bankCard: 'Bank Card (Russian)',
    copyAddress: 'Copy Address',
    copied: 'Copied!',
    openPayPal: 'Open PayPal',
    copyCard: 'Copy Card Number',
    afterPayment: 'After payment, write to Telegram: @your_support_bot with confirmation. You will receive a link to download VIP version.',
    telegramButton: '📱 Write in Telegram',
    
    // Upgrade Modal
    upgradeTitle: '🔒 VIP Access Required',
    upgradeDesc: 'This server is only available for VIP users',
    upgradeButton: 'Buy VIP for $3.99/month',
    stayFree: 'Stay Free',
    
    // Settings
    settingsTitle: 'Settings',
    generalTab: 'General',
    autoStart: 'Start with system',
    minimizeToTray: 'Minimize to tray',
    updatesTab: 'Updates',
    currentVersion: 'Current version:',
    checkUpdates: '🔄 Check for Updates',
    autoCheckUpdates: 'Automatically check for updates on startup',
    
    // Footer
    settingsLink: '⚙️ Settings',
    aboutLink: 'ℹ️ About',
    helpLink: '📖 Help',

    // Info block
    infoFree: 'Free DNS',
    infoVip: 'VIP',
    infoVipAuto: 'Auto pool',
    infoFailover: 'Failover',
    infoFailoverDesc: 'Auto switch on fail',

    // Settings card
    settingsTitle: 'Settings',
    settingAutoConnect: 'Auto-connect on launch',
    settingPreferVip: 'Prefer VIP when available',
    settingAutoFailover: 'Auto failover for Free',
    
    // About
    aboutTitle: 'ℹ️ About DNS Shield Pro',
    aboutDesc: 'Secure and private DNS manager with DoH/DoT encryption',
    
    // Main Tabs
    tabPrivateDNS: '🛡️ Private DNS',
    tabPublicDNS: '🌐 Public DNS',
    tabTools: '🔧 Tools',
    
    // Public DNS
    publicDNSTitle: '🌐 Public DNS Servers',
    publicDNSDesc: 'Choose a public DNS provider (free for everyone)',
    publicDNSInfo: '💡 Public DNS servers are free and don\'t require a subscription. Click on any DNS to see setup instructions.',
    
    // Tools
    toolsTitle: '🔧 Tools & Utilities',
    toolsDesc: 'Useful tools for network and security',
    toolsLimitFree: '⏰ Free: Limited usage per week',
    toolsLimitPremium: '💎 Premium: 5x more usage + exclusive tools'
  },
  
  ru: {
    appTitle: 'DNS Защита Pro',
    version: 'v1.0.0',
    free: 'БЕСПЛАТНО',
    vip: '👑 VIP',
    
    // Status & Connection
    connected: 'Подключено',
    disconnected: 'Отключено',
    connecting: 'Подключение...',
    connect: 'ПОДКЛЮЧИТЬ',
    disconnect: 'ОТКЛЮЧИТЬ',
    online: 'В сети',
    offline: 'Не в сети',
    
    // Servers
    selectServer: 'Выберите сервер:',
    serverSelection: 'Выбор сервера',
    vipOnly: 'Только для VIP',
    vipRequired: 'Требуется VIP подписка',
    upgradeToVip: 'Обновиться до VIP',
    
    // Buttons
    testConnection: '🧪 Тест соединения',
    testing: 'Тестирование...',
    donate: '❤️ Поддержать проект',
    settingsBtn: 'Настройки',
    donateBtn: 'Поддержать / VIP',
    
    // Stats
    statsTitle: 'Статистика (сегодня)',
    queriesCount: 'Запросов:',
    blockedCount: 'Заблокировано:',
    dataSaved: 'Сэкономлено:',
    
    // Status Messages
    connectionSuccess: 'Подключение успешно!',
    connectionFailed: 'Ошибка подключения!',
    noServerAvailable: 'Нет доступных серверов',
    
    // Donation Modal
    donateTitle: '❤️ Поддержать DNS Shield Pro',
    donateDesc: 'Станьте VIP пользователем и получите доступ ко всем премиум серверам!',
    vipBenefit1: 'Доступ к VIP пулу (DE/FR/PL)',
    vipBenefit2: 'Приоритетная скорость',
    vipBenefit3: 'Без ограничений',
    vipBenefits: 'Преимущества VIP:',
    pricing: 'Цены:',
    paymentMethods: 'Способы оплаты:',
    cryptoUSDT: 'Крипто (USDT TRC-20)',
    cryptoBTC: 'Крипто (BTC)',
    bankCard: 'Банковская карта (РФ)',
    copyAddress: 'Скопировать адрес',
    copied: 'Скопировано!',
    openPayPal: 'Открыть PayPal',
    copyCard: 'Скопировать номер',
    afterPayment: 'После оплаты напишите в Telegram: @your_support_bot с подтверждением. Вы получите ссылку на скачивание VIP версии.',
    telegramButton: '📱 Написать в Telegram',
    
    // Upgrade Modal
    upgradeTitle: '🔒 Требуется VIP доступ',
    upgradeDesc: 'Этот сервер доступен только для VIP пользователей',
    upgradeButton: 'Купить VIP за $3.99/месяц',
    stayFree: 'Остаться на Free',
    
    // Settings
    settingsTitle: 'Настройки',
    generalTab: 'Общие',
    autoStart: 'Запускать при старте системы',
    minimizeToTray: 'Сворачивать в трей',
    updatesTab: 'Обновления',
    currentVersion: 'Текущая версия:',
    checkUpdates: '🔄 Проверить обновления',
    autoCheckUpdates: 'Автоматически проверять обновления при запуске',
    
    // Footer
    settingsLink: '⚙️ Настройки',
    aboutLink: 'ℹ️ О программе',
    helpLink: '📖 Помощь',

    // Info block
    infoFree: 'Бесплатный DNS',
    infoVip: 'VIP',
    infoVipAuto: 'Авто пул',
    infoFailover: 'Фейловер',
    infoFailoverDesc: 'Автопереключение при сбое',

    // Settings card
    settingsTitle: 'Настройки',
    settingAutoConnect: 'Автоподключение при запуске',
    settingPreferVip: 'Предпочитать VIP при наличии',
    settingAutoFailover: 'Авто-фейловер для Free',
    
    // About
    aboutTitle: 'ℹ️ О DNS Shield Pro',
    aboutDesc: 'Безопасный и приватный DNS менеджер с шифрованием DoH/DoT',
    
    // Main Tabs
    tabPrivateDNS: '🛡️ Приватные DNS',
    tabPublicDNS: '🌐 Публичные DNS',
    tabTools: '🔧 Инструменты',
    
    // Public DNS
    publicDNSTitle: '🌐 Публичные DNS серверы',
    publicDNSDesc: 'Выберите публичный DNS провайдер (бесплатно для всех)',
    publicDNSInfo: '💡 Публичные DNS серверы бесплатны и не требуют подписки. Нажмите на любой DNS чтобы увидеть инструкции по настройке.',
    
    // Tools
    toolsTitle: '🔧 Инструменты и утилиты',
    toolsDesc: 'Полезные инструменты для сети и безопасности',
    toolsLimitFree: '⏰ Бесплатно: Ограниченное использование в неделю',
    toolsLimitPremium: '💎 Премиум: в 5 раз больше использований + эксклюзивные инструменты'
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, TRANSLATIONS };
}
