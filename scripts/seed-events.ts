import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const events = [
  {
    title: 'Hirohiko Araki’s JoJo’s Bizarre Adventure (Kyoto)',
    status: 'Upcoming',
    artistName: 'Hirohiko Araki',
    artistAvatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Hirohiko_Araki_2019.jpg/800px-Hirohiko_Araki_2019.jpg',
    artistDetailName: 'Hirohiko Araki',
    artistDetailAvatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Hirohiko_Araki_2019.jpg/800px-Hirohiko_Araki_2019.jpg',
    artistBirth: '1960, Sendai, Miyagi Prefecture',
    artistBio:
      'Hirohiko Araki started publishing his series JoJo’s Bizarre Adventure in Weekly Shonen Jump in 1986. The ninth part, titled The JOJOLands, is currently being published in the monthly magazine Ultra Jump. A Stand appears in the third part, Stardust Crusaders. It always remains at its owner’s side as it fights.',
    period: '2026.11.14-2026.11.16',
    location: 'Higashi Honganji Temple, Kyoto',
    posterUrl:
      'https://mangaart.jp/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fk789xrk0yzk2%2F74GASAnmCTv0QwscOsrFb5%2Fdd6d72cf2ce2d85ac283720d1d812430%2FJOJO_MSP_exhibition-banner-20250905.jpg%3Fw%3D1500%26fm%3Davif%26q%3D50&w=3840&q=75',
    introductionImageUrl:
      'https://images.ctfassets.net/k789xrk0yzk2/1xtnv1J8lVzRQQ5Uv8ZGc7/c9f384dc12cafbb9966157e052c51438/JOJO_lenticular_20250904_2.jpg??w=1500&fm=avif&q=50',
    introductionVideoCover:
      '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1116410633?h=1d960d49f2&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Hirohiko Araki &quot;JOJO&#039;s bizarre adventure&quot; art print exhibition at San Francisco &amp; Kyoto 2025"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>',
    exhibitionName: 'Hirohiko Araki’s JoJo’s Bizarre Adventure (Kyoto)',
    exhibitionDuration: '2026.11.14-2026.11.16',
    exhibitionLocation: 'Higashi Honganji Temple (Kyoto)',
    exhibitionCurator: 'Shueisha Manga-Art Heritage',
    dates: JSON.stringify([
      '2026-11-14 10:00 AM',
      '2026-11-15 10:00 AM',
      '2026-11-16 10:00 AM',
    ]),
  },
  {
    title: 'Eiichiro Oda’s ONE PIECE / The Scroll Ⅱ (Kyoto)',
    status: 'Upcoming',
    artistName: 'Eiichiro Oda',
    artistAvatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Eiichiro_Oda_sign.svg/1200px-Eiichiro_Oda_sign.svg.png',
    artistDetailName: 'Eiichiro Oda',
    artistDetailAvatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Eiichiro_Oda_sign.svg/1200px-Eiichiro_Oda_sign.svg.png',
    artistBirth: '1975, Kumamoto Prefecture',
    artistBio:
      'Eiichiro Oda born January 1, 1975 in Kumamoto City, Kumamoto Prefecture in Japan, is a professional mangaka, best known as the creator of the manga One Piece. In 1992, Oda received the Weekly Shonen Jump Tezuka Award for Wanted! Serialization of ONE PIECE began five years later in 1997.',
    period: '2026.11.14-2026.12.13',
    location: 'Benrido Collotype Gallery, Kyoto',
    posterUrl:
      'https://mangaart.jp/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fk789xrk0yzk2%2F7McMX0fXefDnT4PvxR0pcZ%2F8a64037c4798a615bc98651bde5f8883%2FOP_The_Scroll_2_main_%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A7__%C3%A5__C%C3%A3__%C3%A3__.jpg%3Fw%3D1500%26fm%3Davif%26q%3D50&w=3840&q=75',
    introductionImageUrl:
      'https://images.ctfassets.net/k789xrk0yzk2/12GKrPRgbcsjwKYEp2E82S/502b3dec91ca0182c3f71d0c699fcd3b/OPS_Echizenwashi_01.jpg??w=1500&fm=avif&q=50',
    introductionVideoCover:
      '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1143428398?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="&quot;ONE PIECE / The Scroll II&quot; Benrido Collotype Gallery (Kyoto)"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>',
    exhibitionName: 'Eiichiro Oda’s ONE PIECE / The Scroll Ⅱ (Kyoto)',
    exhibitionDuration: '2026.11.14-2026.12.13',
    exhibitionLocation: 'Benrido Collotype Gallery (Kyoto)',
    exhibitionCurator: 'Shueisha Manga-Art Heritage',
    dates: JSON.stringify([
      '2026-11-14 10:00 AM',
      '2026-11-15 10:00 AM',
      '2026-11-16 10:00 AM',
    ]),
  },
  {
    title: 'Keiichi Tanaami "TANAAMI!! AKATSUKA!!" (Tokyo)',
    status: 'Upcoming',
    artistName: 'Keiichi Tanaami',
    artistAvatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Keiichi_Tanaami_portrait.jpg/800px-Keiichi_Tanaami_portrait.jpg',
    artistDetailName: 'Keiichi Tanaami (1936–2024)',
    artistDetailAvatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Keiichi_Tanaami_portrait.jpg/800px-Keiichi_Tanaami_portrait.jpg',
    artistBirth: '1936, Tokyo (Died 2024)',
    artistBio:
      'Keiichi Tanaami (1936–2024) was born in Tokyo and graduated from Musashino Art University. A pioneer of Pop Art in postwar Japan, he actively crossed boundaries of media and genres, creating animation, silkscreen prints, illustrations, collages, experimental films, paintings, and sculptures. His work, often characterized by psychedelic imagery and "editing" design methodologies, explores themes of life, death, and memory.',
    period: '2026.09.05-2026.10.04',
    location: 'Shueisha Manga-Art Heritage Tokyo Gallery, Azabudai Hills',
    posterUrl:
      'https://mangaart.jp/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fk789xrk0yzk2%2F332Dqhj3tkopRDP8BcNAPb%2F7e52048ce1f9d6a30a95e488d34cf357%2FREV_GR_006_banner.jpg%3Fw%3D1500%26fm%3Davif%26q%3D50&w=3840&q=75',
    introductionImageUrl:
      'https://mangaart.jp/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fk789xrk0yzk2%2F332Dqhj3tkopRDP8BcNAPb%2F7e52048ce1f9d6a30a95e488d34cf357%2FREV_GR_006_banner.jpg%3Fw%3D1500%26fm%3Davif%26q%3D50&w=3840&q=75',
    introductionVideoCover:
      '<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1143431086?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>',
    exhibitionName: 'Keiichi Tanaami "TANAAMI!! AKATSUKA!!" (Tokyo)',
    exhibitionDuration: '2026.09.05-2026.10.04',
    exhibitionLocation:
      'Shueisha Manga-Art Heritage Tokyo Gallery (Azabudai Hills)',
    exhibitionCurator: 'Shueisha Manga-Art Heritage',
    dates: JSON.stringify([
      '2026-09-05 11:00 AM',
      '2026-09-06 11:00 AM',
      '2026-09-07 11:00 AM',
    ]),
  },
]

async function main() {
  console.log('Seeding all events...')

  for (const eventData of events) {
    console.log(`Processing event: ${eventData.title}`)

    // Clean up existing event to avoid duplicates
    await prisma.event.deleteMany({
      where: {
        title: eventData.title,
      },
    })

    const event = await prisma.event.create({
      data: eventData,
    })

    console.log(`Created event: ${event.title} (${event.id})`)
  }

  console.log('All events seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
