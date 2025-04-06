// Somerset West Workspace Data
// This file contains mock data for coffee shops and workspaces in Somerset West, South Africa

const workspaceData = [
    {
      id: 'bootlegger-somerset-west',
      name: 'Bootlegger Coffee Company',
      address: 'Shop 5, The Sanctuary Shopping Centre, Broadway Blvd, Somerset West, 7130',
      coordinates: {
        lat: -34.079835, 
        lng: 18.821111
      },
      googleRating: 4.5,
      googleReviews: 356,
      hours: 'Mon-Fri: 6:30am - 5:00pm, Sat-Sun: 7:00am - 3:00pm',
      phone: '+27 21 851 5555',
      website: 'https://bootlegger.co.za/',
      metrics: {
        internet: {
          score: 4.7,
          details: {
            avgDownload: 58.2,
            avgUpload: 22.5,
            avgPing: 15,
            stability: 4.5,
            coverage: 4.8
          }
        },
        video: {
          score: 4.5,
          details: {
            quality: 4.6,
            stability: 4.3,
            privacy: 3.8
          }
        },
        vibe: {
          score: 4.2,
          details: {
            noiseLevel: 3.1,
            atmosphere: 4.6,
            crowdedness: 3.5,
            music: 4.3
          }
        },
        wifi: {
          score: 4.8,
          details: {
            coverage: 4.9,
            login: 'Free, no password',
            reconnect: 4.7
          }
        },
        power: {
          score: 4.0,
          details: {
            outlets: 3.8,
            accessibility: 4.1,
            placement: 4.0
          }
        },
        coffee: {
          score: 4.7
        },
        parking: {
          score: 4.5
        },
        price: {
          score: 3.6
        },
        staff: {
          score: 4.5
        }
      },
      popularWithTribes: ['Code Conjurer', 'Word Weaver', 'Buzz Beast'],
      rankings: {
        wifi: 1,
        vibe: 2,
        parking: 3
      },
      talkingPoints: [
        "Excellent WiFi perfect for video calls and large file uploads",
        "Great coffee selection with expert baristas",
        "Ample table space with power outlets along the walls",
        "Can get crowded during mid-morning rush",
        "Good parking available in the shopping center"
      ],
      reviews: [
        {
          user: "MariaK",
          tribe: "Word Weaver",
          comment: "I love the atmosphere here. The WiFi never disappoints and the coffee keeps me going through long writing sessions.",
          metrics: {
            vibe: 5,
            noise: 3,
            power: 4,
            coffee: 5,
            staff: 5,
            parking: 4,
            price: 3,
            video: 4,
            privacy: 3,
            accessibility: 4
          },
          timestamp: "2024-08-15T09:23:00"
        },
        {
          user: "DevJosh",
          tribe: "Code Conjurer",
          comment: "My go-to spot for coding. The internet is blazing fast and stable. Only downside is it gets pretty busy so arrive early to grab a good seat near a power outlet.",
          metrics: {
            vibe: 4,
            noise: 3,
            power: 4,
            coffee: 5,
            staff: 4,
            parking: 5,
            price: 3,
            video: 5,
            privacy: 3,
            accessibility: 4
          },
          timestamp: "2024-09-02T10:15:00"
        }
      ]
    },
    {
      id: 'blue-crane-coffee-company',
      name: 'Blue Crane Coffee Company',
      address: 'Corner of Main Road and, Coronation Ave, Somerset West, 7130',
      coordinates: {
        lat: -34.076241,
        lng: 18.849648
      },
      googleRating: 4.6,
      googleReviews: 288,
      hours: 'Mon-Fri: 7:00am - 5:00pm, Sat: 8:00am - 3:00pm, Sun: 8:00am - 1:00pm',
      phone: '+27 21 300 3400',
      website: 'https://bluecrane.co.za/',
      metrics: {
        internet: {
          score: 4.5,
          details: {
            avgDownload: 50.1,
            avgUpload: 18.2,
            avgPing: 18,
            stability: 4.3,
            coverage: 4.8
          }
        },
        video: {
          score: 4.1,
          details: {
            quality: 4.3,
            stability: 4.0,
            privacy: 4.0
          }
        },
        vibe: {
          score: 4.8,
          details: {
            noiseLevel: 2.5,
            atmosphere: 4.9,
            crowdedness: 3.2,
            music: 4.5
          }
        },
        wifi: {
          score: 4.3,
          details: {
            coverage: 4.2,
            login: 'Ask for password',
            reconnect: 4.4
          }
        },
        power: {
          score: 4.2,
          details: {
            outlets: 4.3,
            accessibility: 4.1,
            placement: 4.2
          }
        },
        coffee: {
          score: 4.9
        },
        parking: {
          score: 4.1
        },
        price: {
          score: 3.2
        },
        staff: {
          score: 4.8
        }
      },
      popularWithTribes: ['Pixel Wizard', 'Word Weaver', 'Strategy Sage'],
      rankings: {
        wifi: 3,
        vibe: 1,
        parking: 5
      },
      talkingPoints: [
        "Best overall atmosphere for creative work in Somerset West",
        "Artisanal coffee that's worth the slightly higher price",
        "Good mix of tables and comfortable seating options",
        "Quieter environment perfect for focus work",
        "Street parking can be limited during peak hours"
      ],
      reviews: [
        {
          user: "DesignDani",
          tribe: "Pixel Wizard",
          comment: "This place has the perfect vibe for creative work. The lighting is great and the atmosphere is inspiring. WiFi is reliable for uploading design files.",
          metrics: {
            vibe: 5,
            noise: 2,
            power: 4,
            coffee: 5,
            staff: 5,
            parking: 3,
            price: 2,
            video: 4,
            privacy: 4,
            accessibility: 4
          },
          timestamp: "2024-08-22T13:45:00"
        },
        {
          user: "ConsultantCarl",
          tribe: "Strategy Sage",
          comment: "Perfect spot for client calls. The back area is quiet and the coffee is exceptional. Staff really understand the needs of working professionals.",
          metrics: {
            vibe: 5,
            noise: 2,
            power: 4,
            coffee: 5,
            staff: 5,
            parking: 4,
            price: 3,
            video: 4,
            privacy: 5,
            accessibility: 4
          },
          timestamp: "2024-09-05T09:30:00"
        }
      ]
    },
    {
      id: 'truth-coffee-somerset-west',
      name: 'Truth Coffee',
      address: 'Somerset Mall, Somerset West, 7130',
      coordinates: {
        lat: -34.080505,
        lng: 18.805760
      },
      googleRating: 4.4,
      googleReviews: 215,
      hours: 'Mon-Sun: 8:00am - 9:00pm',
      phone: '+27 21 850 8326',
      website: 'https://truth.coffee/',
      metrics: {
        internet: {
          score: 3.9,
          details: {
            avgDownload: 35.2,
            avgUpload: 12.1,
            avgPing: 22,
            stability: 3.7,
            coverage: 4.2
          }
        },
        video: {
          score: 3.8,
          details: {
            quality: 3.9,
            stability: 3.7,
            privacy: 3.2
          }
        },
        vibe: {
          score: 4.1,
          details: {
            noiseLevel: 3.8,
            atmosphere: 4.5,
            crowdedness: 3.9,
            music: 4.0
          }
        },
        wifi: {
          score: 4.0,
          details: {
            coverage: 4.0,
            login: 'Mall WiFi, requires registration',
            reconnect: 3.8
          }
        },
        power: {
          score: 3.5,
          details: {
            outlets: 3.3,
            accessibility: 3.5,
            placement: 3.7
          }
        },
        coffee: {
          score: 4.8
        },
        parking: {
          score: 4.9
        },
        price: {
          score: 3.0
        },
        staff: {
          score: 4.2
        }
      },
      popularWithTribes: ['Buzz Beast', 'Vision Voyager', 'Digital Nomad'],
      rankings: {
        wifi: 5,
        vibe: 4,
        parking: 1
      },
      talkingPoints: [
        "Located in Somerset Mall with excellent parking",
        "Award-winning coffee but can be pricey",
        "Good for short work sessions but gets noisy during mall peak times",
        "Limited power outlets so come with a charged device",
        "Mall WiFi can be inconsistent during busy periods"
      ],
      reviews: [
        {
          user: "StartupSam",
          tribe: "Vision Voyager",
          comment: "Great for client meetings due to central location. Coffee is amazing but WiFi can be spotty when the mall is busy.",
          metrics: {
            vibe: 4,
            noise: 4,
            power: 3,
            coffee: 5,
            staff: 4,
            parking: 5,
            price: 2,
            video: 3,
            privacy: 3,
            accessibility: 5
          },
          timestamp: "2024-07-30T14:20:00"
        },
        {
          user: "MarketingMaya",
          tribe: "Buzz Beast",
          comment: "Love coming here between meetings. The central location is perfect and there's always parking. Just wish there were more power outlets.",
          metrics: {
            vibe: 4,
            noise: 4,
            power: 3,
            coffee: 5,
            staff: 4,
            parking: 5,
            price: 3,
            video: 4,
            privacy: 3,
            accessibility: 5
          },
          timestamp: "2024-08-12T11:15:00"
        }
      ]
    },
    {
      id: 'vida-e-caffe-somerset-west',
      name: 'Vida e Caffè',
      address: 'Southey St, Helderberg Estate, Somerset West, 7130',
      coordinates: {
        lat: -34.073290,
        lng: 18.843349
      },
      googleRating: 4.2,
      googleReviews: 189,
      hours: 'Mon-Fri: 6:30am - 6:00pm, Sat-Sun: 7:30am - 5:00pm',
      phone: '+27 21 852 7227',
      website: 'https://vidaecaffe.com/',
      metrics: {
        internet: {
          score: 4.1,
          details: {
            avgDownload: 42.6,
            avgUpload: 15.2,
            avgPing: 25,
            stability: 3.9,
            coverage: 4.1
          }
        },
        video: {
          score: 3.9,
          details: {
            quality: 4.0,
            stability: 3.8,
            privacy: 3.4
          }
        },
        vibe: {
          score: 3.9,
          details: {
            noiseLevel: 3.7,
            atmosphere: 4.2,
            crowdedness: 3.5,
            music: 3.8
          }
        },
        wifi: {
          score: 4.1,
          details: {
            coverage: 4.2,
            login: 'Free with purchase, get code on receipt',
            reconnect: 4.0
          }
        },
        power: {
          score: 3.8,
          details: {
            outlets: 3.9,
            accessibility: 3.7,
            placement: 3.8
          }
        },
        coffee: {
          score: 4.3
        },
        parking: {
          score: 4.0
        },
        price: {
          score: 3.8
        },
        staff: {
          score: 4.0
        }
      },
      popularWithTribes: ['Knowledge Seeker', 'Code Conjurer', 'Digital Nomad'],
      rankings: {
        wifi: 4,
        vibe: 5,
        parking: 6
      },
      talkingPoints: [
        "Consistent WiFi suitable for most work needs",
        "Good value for money compared to boutique coffee shops",
        "Early opening hours make it perfect for morning productivity",
        "Standard chain experience but reliable for work sessions",
        "Staff accustomed to workspace users staying for longer periods"
      ],
      reviews: [
        {
          user: "StudentSteve",
          tribe: "Knowledge Seeker",
          comment: "Great affordable spot for study sessions. The WiFi password system is a bit annoying as you need to buy something every few hours, but the coffee is good value.",
          metrics: {
            vibe: 4,
            noise: 3,
            power: 4,
            coffee: 4,
            staff: 4,
            parking: 4,
            price: 4,
            video: 4,
            privacy: 3,
            accessibility: 4
          },
          timestamp: "2024-08-05T08:45:00"
        },
        {
          user: "DevDave",
          tribe: "Code Conjurer",
          comment: "Solid option when Bootlegger is full. WiFi is reliable for most development tasks and they open early which is great for morning coding sessions.",
          metrics: {
            vibe: 4,
            noise: 3,
            power: 4,
            coffee: 4,
            staff: 4,
            parking: 4,
            price: 4,
            video: 4,
            privacy: 3,
            accessibility: 4
          },
          timestamp: "2024-09-01T07:30:00"
        }
      ]
    },
    {
      id: 'terbodore-coffee',
      name: 'Terbodore Coffee',
      address: 'Waterstone Village, R44 & Main Rd, Somerset West, 7130',
      coordinates: {
        lat: -34.091042,
        lng: 18.824997
      },
      googleRating: 4.5,
      googleReviews: 222,
      hours: 'Mon-Sat: 7:30am - 5:00pm, Sun: 8:00am - 3:00pm',
      phone: '+27 21 851 7103',
      website: 'https://www.terbodorecoffee.co.za/',
      metrics: {
        internet: {
          score: 4.3,
          details: {
            avgDownload: 45.5,
            avgUpload: 16.8,
            avgPing: 20,
            stability: 4.1,
            coverage: 4.3
          }
        },
        video: {
          score: 4.0,
          details: {
            quality: 4.1,
            stability: 4.0,
            privacy: 3.5
          }
        },
        vibe: {
          score: 4.5,
          details: {
            noiseLevel: 3.2,
            atmosphere: 4.7,
            crowdedness: 3.8,
            music: 4.4
          }
        },
        wifi: {
          score: 4.2,
          details: {
            coverage: 4.3,
            login: 'Password on receipt',
            reconnect: 4.1
          }
        },
        power: {
          score: 4.5,
          details: {
            outlets: 4.6,
            accessibility: 4.4,
            placement: 4.5
          }
        },
        coffee: {
          score: 4.8
        },
        parking: {
          score: 4.3
        },
        price: {
          score: 3.3
        },
        staff: {
          score: 4.6
        }
      },
      popularWithTribes: ['Word Weaver', 'Pixel Wizard', 'Strategy Sage'],
      rankings: {
        wifi: 2,
        vibe: 3,
        parking: 4
      },
      talkingPoints: [
        "Excellent specialty coffee for the discerning coffee lover",
        "Recently upgraded their power outlets - abundant and accessible",
        "Great natural light for creative work",
        "Staff is accommodating to remote workers",
        "Good mix of tables including some larger ones for spreading out work"
      ],
      reviews: [
        {
          user: "WriterWendy",
          tribe: "Word Weaver",
          comment: "The ambiance here is perfect for creative writing. The coffee is outstanding and the WiFi is reliable. Love the natural light by the windows.",
          metrics: {
            vibe: 5,
            noise: 3,
            power: 5,
            coffee: 5,
            staff: 5,
            parking: 4,
            price: 3,
            video: 4,
            privacy: 4,
            accessibility: 4
          },
          timestamp: "2024-08-18T10:30:00"
        },
        {
          user: "AnalyticsAdam",
          tribe: "Strategy Sage",
          comment: "My preferred spot for deep work. They've added many more power outlets recently which is a game-changer. Coffee is excellent but a bit pricey.",
          metrics: {
            vibe: 5,
            noise: 3,
            power: 5,
            coffee: 5,
            staff: 4,
            parking: 4,
            price: 3,
            video: 4,
            privacy: 4,
            accessibility: 4
          },
          timestamp: "2024-08-25T09:15:00"
        }
      ]
    },
    {
      id: 'schoon-somerset-west',
      name: 'SCHOON',
      address: 'Corner of Bright & Reitz Streets, Somerset West, 7130',
      coordinates: {
        lat: -34.075548,
        lng: 18.845006
      },
      googleRating: 4.7,
      googleReviews: 178,
      hours: 'Mon-Fri: 7:00am - 4:00pm, Sat: 8:00am - 2:00pm, Sun: Closed',
      phone: '+27 21 852 0022',
      website: 'https://schoon.co.za/',
      metrics: {
        internet: {
          score: 4.0,
          details: {
            avgDownload: 38.7,
            avgUpload: 14.5,
            avgPing: 22,
            stability: 3.9,
            coverage: 4.1
          }
        },
        video: {
          score: 3.7,
          details: {
            quality: 3.8,
            stability: 3.7,
            privacy: 3.3
          }
        },
        vibe: {
          score: 4.7,
          details: {
            noiseLevel: 3.4,
            atmosphere: 4.9,
            crowdedness: 3.6,
            music: 4.5
          }
        },
        wifi: {
          score: 3.9,
          details: {
            coverage: 3.8,
            login: 'Ask for password',
            reconnect: 4.0
          }
        },
        power: {
          score: 3.6,
          details: {
            outlets: 3.5,
            accessibility: 3.7,
            placement: 3.6
          }
        },
        coffee: {
          score: 4.9
        },
        parking: {
          score: 3.8
        },
        price: {
          score: 2.8
        },
        staff: {
          score: 4.8
        }
      },
      popularWithTribes: ['Pixel Wizard', 'Word Weaver', 'Digital Nomad'],
      rankings: {
        wifi: 6,
        vibe: 2,
        parking: 7
      },
      talkingPoints: [
        "Exceptional artisanal coffee and freshly baked goods",
        "Beautiful interior design and atmosphere",
        "WiFi is decent but not optimized for heavy work use",
        "Limited power outlets - come with charged devices",
        "Premium pricing but worth it for the quality and ambiance"
      ],
      reviews: [
        {
          user: "DesignerDon",
          tribe: "Pixel Wizard",
          comment: "The aesthetic here is incredible - so inspiring for design work. The WiFi could be better but the atmosphere makes up for it. Their croissants are life-changing.",
          metrics: {
            vibe: 5,
            noise: 3,
            power: 3,
            coffee: 5,
            staff: 5,
            parking: 4,
            price: 2,
            video: 3,
            privacy: 3,
            accessibility: 4
          },
          timestamp: "2024-08-10T09:45:00"
        },
        {
          user: "FreelanceFiona",
          tribe: "Digital Nomad",
          comment: "Beautiful space but not ideal for all-day work sessions due to limited power outlets. Great for creative brainstorming with clients though!",
          metrics: {
            vibe: 5,
            noise: 3,
            power: 3,
            coffee: 5,
            staff: 5,
            parking: 3,
            price: 3,
            video: 4,
            privacy: 4,
            accessibility: 3
          },
          timestamp: "2024-08-28T11:20:00"
        }
      ]
    },
    {
      id: 'blue-water-cafe',
      name: 'Blue Water Café',
      address: 'Imhoff Farm, Kommetjie Rd, Somerset West, 7975',
      coordinates: {
        lat: -34.063580,
        lng: 18.853930
      },
      googleRating: 4.3,
      googleReviews: 165,
      hours: 'Mon-Sun: 9:00am - 5:00pm',
      phone: '+27 21 852 4888',
      website: 'https://bluewatercafe.co.za/',
      metrics: {
        internet: {
          score: 3.2,
          details: {
            avgDownload: 25.6,
            avgUpload: 8.9,
            avgPing: 35,
            stability: 3.0,
            coverage: 3.4
          }
        },
        video: {
          score: 2.8,
          details: {
            quality: 2.9,
            stability: 2.7,
            privacy: 3.5
          }
        },
        vibe: {
          score: 4.6,
          details: {
            noiseLevel: 3.5,
            atmosphere: 4.9,
            crowdedness: 3.2,
            music: 4.3
          }
        },
        wifi: {
          score: 3.0,
          details: {
            coverage: 3.1,
            login: 'Free with purchase',
            reconnect: 2.8
          }
        },
        power: {
          score: 2.7,
          details: {
            outlets: 2.5,
            accessibility: 2.8,
            placement: 2.8
          }
        },
        coffee: {
          score: 4.2
        },
        parking: {
          score: 4.7
        },
        price: {
          score: 3.5
        },
        staff: {
          score: 4.5
        }
      },
      popularWithTribes: ['Pixel Wizard', 'Vision Voyager', 'Digital Nomad'],
      rankings: {
        wifi: 8,
        vibe: 3,
        parking: 2
      },
      talkingPoints: [
        "Stunning ocean views and natural surroundings",
        "More of an inspiration spot than a productive workspace",
        "Limited WiFi capability - not suitable for video calls or large file transfers",
        "Very few power outlets available",
        "Perfect for creative brainstorming sessions or light work with a view"
      ],
      reviews: [
        {
          user: "CreativeCarl",
          tribe: "Pixel Wizard",
          comment: "I come here when I need inspiration. The view is incredible but don't expect to do any serious uploading or downloading. More of a sketching and ideation spot.",
          metrics: {
            vibe: 5,
            noise: 3,
            power: 2,
            coffee: 4,
            staff: 4,
            parking: 5,
            price: 3,
            video: 2,
            privacy: 4,
            accessibility: 3
          },
          timestamp: "2024-08-14T13:30:00"
        },
        {
          user: "StartupSarah",
          tribe: "Vision Voyager",
          comment: "Perfect spot for strategic thinking and planning. The peaceful environment helps clear my mind, but it's not where I'd try to do technical work requiring good internet.",
          metrics: {
            vibe: 5,
            noise: 3,
            power: 3,
            coffee: 4,
            staff: 5,
            parking: 5,
            price: 4,
            video: 3,
            privacy: 4,
            accessibility: 3
          },
          timestamp: "2024-09-03T10:45:00"
        }
      ]
    },
    {
      id: 'payot-coffee',
      name: 'Payot Coffee',
      address: '9 Centenary Rd, Somerset West, 7130',
      coordinates: {
        lat: -34.073879,
        lng: 18.846151
      },
      googleRating: 4.4,
      googleReviews: 132,
      hours: 'Mon-Fri: 7:00am - 5:00pm, Sat: 8:00am - 3:00pm, Sun: Closed',
      phone: '+27 21 851 2893',
      website: 'https://payotcoffee.co.za/',
      metrics: {
        internet: {
          score: 4.4,
          details: {
            avgDownload: 47.8,
            avgUpload: 18.2,
            avgPing: 17,
            stability: 4.3,
            coverage: 4.5
          }
        },
        video: {
          score: 4.2,
          details: {
            quality: 4.3,
            stability: 4.2,
            privacy: 3.9
          }
        },
        vibe: {
          score: 4.0,
          details: {
            noiseLevel: 2.8,
            atmosphere: 4.3,
            crowdedness: 3.1,
            music: 4.0
          }
        },
        wifi: {
          score: 4.5,
          details: {
            coverage: 4.6,
            login: 'Password displayed in shop',
            reconnect: 4.4
          }
        },
        power: {
          score: 4.6,
          details: {
            outlets: 4.7,
            accessibility: 4.5,
            placement: 4.6
          }
        },
        coffee: {
          score: 4.4
        },
        parking: {
          score: 3.9
        },
        price: {
          score: 3.7
        },
        staff: {
          score: 4.3
        }
      },
      popularWithTribes: ['Code Conjurer', 'Knowledge Seeker', 'Strategy Sage'],
      rankings: {
        wifi: 2,
        vibe: 6,
        parking: 7
      },
      talkingPoints: [
        "Hidden gem for serious work - prioritizes functionality over aesthetics",
        "Excellent power outlet situation - nearly every table has access",
        "Fast and reliable internet suitable for development work",
        "Quieter environment with fewer distractions",
        "Staff understand remote workers' needs"
      ],
      reviews: [
        {
          user: "ProgrammerPaul",
          tribe: "Code Conjurer",
          comment: "My secret productivity spot. Not as flashy as some places but the internet is rock solid and there are power outlets everywhere. Perfect for long coding sessions.",
          metrics: {
            vibe: 4,
            noise: 2,
            power: 5,
            coffee: 4,
            staff: 4,
            parking: 4,
            price: 4,
            video: 5,
            privacy: 4,
            accessibility: 4
          },
          timestamp: "2024-08-20T08:15:00"
        },
        {
          user: "ThesisThomas",
          tribe: "Knowledge Seeker",
          comment: "Best place for focused work in Somerset West. The quiet atmosphere and reliable WiFi make it perfect for research and writing. Staff don't mind if you stay for hours.",
          metrics: {
            vibe: 4,
            noise: 2,
            power: 5,
            coffee: 4,
            staff: 5,
            parking: 4,
            price: 4,
            video: 4,
            privacy: 4,
            accessibility: 4
          },
          timestamp: "2024-08-16T14:20:00"
        }
      ]
    },
    {
      id: 'rialheim-cafe',
      name: 'Rialheim Café',
      address: '67 Dirkie Uys St, Somerset West, 7130',
      coordinates: {
        lat: -34.071923,
        lng: 18.849702
      },
      googleRating: 4.5,
      googleReviews: 118,
      hours: 'Mon-Fri: 8:00am - 4:30pm, Sat: 8:00am - 3:00pm, Sun: Closed',
      phone: '+27 21 851 0691',
      website: 'https://rialheim.com/cafe/',
      metrics: {
        internet: {
          score: 3.8,
          details: {
            avgDownload: 32.4,
            avgUpload: 11.8,
            avgPing: 28,
            stability: 3.7,
            coverage: 3.9
          }
        },
        video: {
          score: 3.5,
          details: {
            quality: 3.6,
            stability: 3.5,
            privacy: 3.8
          }
        },
        vibe: {
          score: 4.8,
          details: {
            noiseLevel: 2.6,
            atmosphere: 4.9,
            crowdedness: 3.4,
            music: 4.6
          }
        },
        wifi: {
          score: 3.7,
          details: {
            coverage: 3.6,
            login: 'Password on menu',
            reconnect: 3.8
          }
        },
        power: {
          score: 3.5,
          details: {
            outlets: 3.4,
            accessibility: 3.5,
            placement: 3.6
          }
        },
        coffee: {
          score: 4.5
        },
        parking: {
          score: 4.0
        },
        price: {
          score: 3.2
        },
        staff: {
          score: 4.7
        }
      },
      popularWithTribes: ['Pixel Wizard', 'Word Weaver', 'Vision Voyager'],
      rankings: {
        wifi: 7,
        vibe: 1,
        parking: 6
      },
      talkingPoints: [
        "Stunning artistic atmosphere with ceramic studio attached",
        "Beautiful garden seating area for good weather days",
        "Internet suitable for basic tasks but not heavy bandwidth work",
        "Limited power outlets - mainly along the walls",
        "Excellent for creative inspiration and artistic pursuits"
      ],
      reviews: [
        {
          user: "WriterWill",
          tribe: "Word Weaver",
          comment: "The atmosphere here is unmatched. It's like working inside an art installation. Great for creative writing but not ideal for research that requires heavy internet use.",
          metrics: {
            vibe: 5,
            noise: 2,
            power: 3,
            coffee: 5,
            staff: 5,
            parking: 4,
            price: 3,
            video: 3,
            privacy: 4,
            accessibility: 4
          },
          timestamp: "2024-08-08T11:15:00"
        },
        {
          user: "ArtistAnna",
          tribe: "Pixel Wizard",
          comment: "My absolute favorite space for inspiration. The ceramic artwork throughout creates such a special environment. WiFi is sufficient for most design uploads but not for video rendering.",
          metrics: {
            vibe: 5,
            noise: 2,
            power: 3,
            coffee: 4,
            staff: 5,
            parking: 4,
            price: 3,
            video: 3,
            privacy: 4,
            accessibility: 3
          },
          timestamp: "2024-09-01T10:30:00"
        }
      ]
    },
    {
      id: 'tashas-somerset-west',
      name: 'Tashas Somerset West',
      address: 'Corner of Drama & Reunion Street, Somerset West, 7130',
      coordinates: {
        lat: -34.077829,
        lng: 18.847053
      },
      googleRating: 4.3,
      googleReviews: 246,
      hours: 'Mon-Sun: 7:00am - 5:00pm',
      phone: '+27 21 851 5289',
      website: 'https://www.tashascafe.com/',
      metrics: {
        internet: {
          score: 3.5,
          details: {
            avgDownload: 28.7,
            avgUpload: 10.2,
            avgPing: 32,
            stability: 3.4,
            coverage: 3.6
          }
        },
        video: {
          score: 3.2,
          details: {
            quality: 3.3,
            stability: 3.1,
            privacy: 3.0
          }
        },
        vibe: {
          score: 4.3,
          details: {
            noiseLevel: 3.9,
            atmosphere: 4.6,
            crowdedness: 4.0,
            music: 4.2
          }
        },
        wifi: {
          score: 3.4,
          details: {
            coverage: 3.3,
            login: 'Password with purchase',
            reconnect: 3.5
          }
        },
        power: {
          score: 3.1,
          details: {
            outlets: 2.9,
            accessibility: 3.2,
            placement: 3.2
          }
        },
        coffee: {
          score: 4.4
        },
        parking: {
          score: 4.1
        },
        price: {
          score: 2.8
        },
        staff: {
          score: 4.0
        }
      },
      popularWithTribes: ['Buzz Beast', 'Strategy Sage', 'Vision Voyager'],
      rankings: {
        wifi: 9,
        vibe: 4,
        parking: 5
      },
      talkingPoints: [
        "Upscale spot perfect for client meetings and networking",
        "Not designed as a workspace but tolerated for shorter sessions",
        "WiFi sufficient for email and basic browsing but not for heavy work",
        "Very limited power outlets",
        "Excellent food but higher price point than typical work cafes"
      ],
      reviews: [
        {
          user: "ConsultingCara",
          tribe: "Strategy Sage",
          comment: "Great for client meetings and breakfast sessions. Not ideal for extended work as they prefer table turnover. WiFi is basic but sufficient for presentations.",
          metrics: {
            vibe: 4,
            noise: 4,
            power: 3,
            coffee: 4,
            staff: 4,
            parking: 4,
            price: 2,
            video: 3,
            privacy: 3,
            accessibility: 4
          },
          timestamp: "2024-08-22T09:00:00"
        },
        {
          user: "MarketingMax",
          tribe: "Buzz Beast",
          comment: "My go-to for client breakfast meetings. The atmosphere is impressive and the food is excellent. Not where I'd spend a full day working though.",
          metrics: {
            vibe: 5,
            noise: 4,
            power: 2,
            coffee: 5,
            staff: 4,
            parking: 4,
            price: 2,
            video: 3,
            privacy: 3,
            accessibility: 4
          },
          timestamp: "2024-08-17T08:45:00"
        }
      ]
    },
    {
      id: 'the-fatcat',
      name: 'The FatCat Coffee Company',
      address: '45 Bright Street, Somerset West, 7130',
      coordinates: {
        lat: -34.075111,
        lng: 18.845822
      },
      googleRating: 4.6,
      googleReviews: 201,
      hours: 'Mon-Fri: 7:30am - 4:30pm, Sat: 8:00am - 2:00pm, Sun: Closed',
      phone: '+27 83 288 1959',
      website: 'https://www.thefatcat.co.za/',
      metrics: {
        internet: {
          score: 4.6,
          details: {
            avgDownload: 54.3,
            avgUpload: 20.1,
            avgPing: 16,
            stability: 4.5,
            coverage: 4.7
          }
        },
        video: {
          score: 4.4,
          details: {
            quality: 4.5,
            stability: 4.4,
            privacy: 3.9
          }
        },
        vibe: {
          score: 4.4,
          details: {
            noiseLevel: 3.0,
            atmosphere: 4.7,
            crowdedness: 3.6,
            music: 4.3
          }
        },
        wifi: {
          score: 4.7,
          details: {
            coverage: 4.8,
            login: 'Password on receipt',
            reconnect: 4.6
          }
        },
        power: {
          score: 4.4,
          details: {
            outlets: 4.5,
            accessibility: 4.3,
            placement: 4.4
          }
        },
        coffee: {
          score: 4.8
        },
        parking: {
          score: 3.8
        },
        price: {
          score: 3.5
        },
        staff: {
          score: 4.7
        }
      },
      popularWithTribes: ['Code Conjurer', 'Word Weaver', 'Digital Nomad'],
      rankings: {
        wifi: 1,
        vibe: 3,
        parking: 8
      },
      talkingPoints: [
        "Excellent dedicated workspace with top-tier WiFi",
        "Recently upgraded their internet specifically for remote workers",
        "Good variety of seating including standing desks in one corner",
        "Power outlets at almost every table",
        "Staff very accommodating to digital nomads and remote workers"
      ],
      reviews: [
        {
          user: "CodeCatherine",
          tribe: "Code Conjurer",
          comment: "The best remote work spot in Somerset West, hands down! Their internet is blazing fast and reliable, perfect for development work. They even have a few standing desks.",
          metrics: {
            vibe: 5,
            noise: 3,
            power: 5,
            coffee: 5,
            staff: 5,
            parking: 3,
            price: 3,
            video: 5,
            privacy: 4,
            accessibility: 4
          },
          timestamp: "2024-08-26T09:15:00"
        },
        {
          user: "RemoteRyan",
          tribe: "Digital Nomad",
          comment: "This place understands digital nomads. Great internet, plenty of power, and they don't mind if you camp out all day as long as you're buying. Coffee is excellent too!",
          metrics: {
            vibe: 4,
            noise: 3,
            power: 5,
            coffee: 5,
            staff: 5,
            parking: 4,
            price: 4,
            video: 5,
            privacy: 4,
            accessibility: 4
          },
          timestamp: "2024-09-05T11:30:00"
        }
      ]
    }
  ];
  
  // Time-based heatmap data
  const generateHeatmapData = (id) => {
    // Find the workspace
    const workspace = workspaceData.find(ws => ws.id === id);
    if (!workspace) return null;
    
    // Base metrics from the workspace
    const baseSpeed = workspace.metrics.internet.details.avgDownload;
    const baseVibe = workspace.metrics.vibe.score;
    const baseParking = workspace.metrics.parking.score;
    
    // Days of the week
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Time slots
    const timeSlots = ['7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm'];
    
    // Generate data
    const speedData = {};
    const vibeData = {};
    const parkingData = {};
    
    days.forEach(day => {
      speedData[day] = {};
      vibeData[day] = {};
      parkingData[day] = {};
      
      timeSlots.forEach(time => {
        // Add some randomness
        const timeOfDay = parseInt(time);
        const isMorning = timeOfDay >= 7 && timeOfDay <= 10;
        const isLunch = timeOfDay >= 11 && timeOfDay <= 13;
        const isAfternoon = timeOfDay >= 14 && timeOfDay <= 18;
        
        // Speed tends to be worse during busy times
        let speedFactor = 1.0;
        if (isLunch) speedFactor = 0.85; // Lunch rush slows down internet
        if (isAfternoon && (day === 'Friday' || day === 'Saturday')) speedFactor = 0.9; // Busy afternoons on weekends
        
        // Vibe tends to be better when it's moderately busy
        let vibeFactor = 1.0;
        if (isLunch) vibeFactor = 1.05; // Lunch has good energy
        if (timeOfDay < 8) vibeFactor = 0.9; // Early morning can be too quiet
        if (timeOfDay > 16 && (day === 'Friday' || day === 'Thursday')) vibeFactor = 1.1; // End of week afternoons are fun
        
        // Parking is worse during busy times
        let parkingFactor = 1.0;
        if (isLunch) parkingFactor = 0.8; // Hard to park during lunch
        if (isAfternoon && (day === 'Saturday')) parkingFactor = 0.75; // Weekend afternoons tough for parking
        if (timeOfDay < 9) parkingFactor = 1.1; // Early morning easy parking
        
        // Add randomness
        const randomVariance = () => (Math.random() * 0.2) - 0.1; // -10% to +10%
        
        // Set the values with some randomness
        const speedVariance = randomVariance();
        const vibeVariance = randomVariance();
        const parkingVariance = randomVariance();
        
        speedData[day][time] = Math.max(5, Math.min(100, baseSpeed * (speedFactor + speedVariance)));
        vibeData[day][time] = Math.max(1, Math.min(5, baseVibe * (vibeFactor + vibeVariance)));
        parkingData[day][time] = Math.max(1, Math.min(5, baseParking * (parkingFactor + parkingVariance)));
      });
    });
    
    return {
      speed: speedData,
      vibe: vibeData,
      parking: parkingData
    };
  };
  
  // Add heatmap data to each workspace
  workspaceData.forEach(workspace => {
    workspace.heatmapData = generateHeatmapData(workspace.id);
  });
  
  // Export the data for use in other scripts
  // In a real application, this would likely be fetched from an API
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { workspaceData };
  } else {
    // For browser usage
    window.workspaceData = workspaceData;
  }