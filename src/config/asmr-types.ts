// ASMR类型配置 - 完整保留所有提示词
export interface ASMRType {
  id: string
  name: string
  description: string
  prompt: string
}

export interface ASMRCategory {
  id: string
  name: string
  icon: string
  types: ASMRType[]
}

// 默认选项（自定义）
export const defaultOption: ASMRType = {
  id: 'default',
  name: 'Custom Prompt',
  description: 'Create your own ASMR scene with custom description',
  prompt: ''
}

// ASMR类型分类定义（重新整理分类）
export const asmrCategories: ASMRCategory[] = [
  {
    id: 'cutting',
    name: 'Cutting & Slicing',
    icon: '🔪',
    types: [
      {
        id: 'glass-fruit-cutting',
        name: 'Glass Fruit Cutting',
        description: 'Knife delicately slicing colorful glass fruits with sparkling effects',
        prompt: 'Realistic 4K footage close-up of a sharp fruit knife delicately slicing a vibrant blue glass apple on a smooth, reflective black surface. It cracks and shatters into sparkling pieces. The inside of the apple is also crystal-clear glass. The sound is ASMR style.'
      },
      {
        id: 'crystal-apple',
        name: 'Crystal Apple Cutting',
        description: 'Slicing translucent green crystal apple with prismatic effects',
        prompt: 'Artistic scene of knife cutting through transparent green crystal apple with prismatic light effects. Camera: Macro lens capturing rainbow light refraction. Lighting: Multi-colored lighting creating spectacular visual effects. Audio: Crystal chiming sounds, delicate breaking, and magical tinkling noises.'
      },
      {
        id: 'crystal-pineapple',
        name: 'Crystal Pineapple Cutting',
        description: 'Cutting golden crystal pineapple with honeycomb structure',
        prompt: 'Fantasy scene of knife cutting through golden crystal pineapple with honeycomb internal structure. Camera: Close-up capturing geometric patterns and light reflections. Lighting: Golden ambient lighting highlighting crystal facets. Audio: Geometric breaking sounds, crystal resonance, and satisfying structural collapse.'
      },
      {
        id: 'crystal-burger',
        name: 'Crystal Burger Cutting',
        description: 'Slicing layered crystal burger with rainbow light effects',
        prompt: 'Surreal scene of knife cutting through transparent crystal burger with layers of colorful crystal ingredients. Camera: Macro lens capturing light refraction through crystal materials. Lighting: Rainbow lighting creating prismatic effects. Audio: Unique crystal chiming sounds, delicate breaking noises, and satisfying cutting through crystalline textures.'
      },
      {
        id: 'red-crystal-sphere',
        name: 'Red Crystal Sphere Cutting',
        description: 'Knife cutting translucent red crystal with bubble chambers',
        prompt: 'Surreal scene of knife cutting through translucent red crystal sphere with internal bubble chambers. Camera: Macro lens capturing light refraction through crystal materials. Lighting: Red ambient lighting creating prismatic effects. Audio: Unique crystal chiming sounds, delicate breaking noises, and satisfying cutting through crystalline textures.'
      },
      {
        id: 'layered-soap-cutting',
        name: 'Layered Soap Cutting',
        description: 'Knife smoothly cutting through colorful layered soap blocks',
        prompt: 'Realistic 4K footage close-up of a sharp knife smoothly slicing through a rainbow-layered soap block on a clean white cutting board. It separates cleanly revealing perfect layers inside. The inside of the soap shows beautiful color gradients. The sound is ASMR style.'
      },
      {
        id: 'honeycomb-cutting',
        name: 'Honeycomb Cutting',
        description: 'Knife cutting through fresh honeycomb with golden honey dripping',
        prompt: 'Realistic 4K footage close-up of a warm knife gently cutting through fresh golden honeycomb on a wooden cutting board. It oozes thick honey that drips slowly. The inside of the honeycomb reveals perfect hexagonal chambers filled with golden honey. The sound is ASMR style.'
      },
      {
        id: 'kinetic-sand-cutting',
        name: 'Kinetic Sand Cutting',
        description: 'Knife slicing through colored kinetic sand revealing smooth textures',
        prompt: 'Realistic 4K footage close-up of a smooth blade cutting through purple kinetic sand molded into a perfect cube on a clean surface. It separates with satisfying precision revealing smooth internal texture. The inside of the sand cube shows perfectly uniform granular structure. The sound is ASMR style.'
      },
      {
        id: 'minecraft-block-cutting',
        name: 'Minecraft Block Cutting ASMR',
        description: 'Sharp blade slicing through pixelated Minecraft blocks with satisfying cuts',
        prompt: 'Realistic 4K footage close-up of a sharp diamond sword smoothly slicing through a colorful pixelated Minecraft grass block on a cubic stone platform. It cuts cleanly revealing layered pixel textures inside. The inside of the block shows dirt pixels beneath grass pixels. The sound is ASMR style with satisfying slicing and block separation sounds.'
      }
    ]
  },
  {
    id: 'textures',
    name: 'Textures & Materials',
    icon: '✨',
    types: [
      {
        id: 'ice-texture',
        name: 'Ice Crystallization ASMR',
        description: 'Peaceful ice formation and natural crystal sounds for relaxation',
        prompt: 'Gentle close-up of ice crystals forming naturally on glass surface. Camera: Macro lens capturing crystalline patterns and light refraction. Lighting: Soft studio lighting highlighting ice transparency and natural formations. Audio: Gentle crystallization sounds, peaceful settling noises, calming natural ice formation sounds for stress relief and meditation.'
      },
      {
        id: 'golden-apple-texture',
        name: 'Golden Apple Texture ASMR',
        description: 'Therapeutic golden fruit textures with gentle natural sounds',
        prompt: 'Peaceful macro view of golden apple with natural texture transitions and gentle surface changes. Camera: Close-up focusing on fruit texture with warm metallic reflections and natural patterns. Lighting: Soft golden lighting enhancing surface details and creating calming ambiance. Audio: Gentle texture sounds, peaceful natural settling, therapeutic audio for relaxation and mindfulness.'
      },
      {
        id: 'lime-texture',
        name: 'Lime Aromatherapy ASMR',
        description: 'Therapeutic citrus textures and natural aromatherapy sounds',
        prompt: 'Peaceful macro view of fresh lime with natural texture exploration and gentle citrus oil release. Camera: Close-up focusing on fruit surface textures and natural juice formation. Lighting: Natural bright lighting enhancing vibrant green colors and droplet formations. Audio: Gentle texture sounds, natural citrus aromatherapy audio, peaceful dripping sounds for stress relief and mindfulness.'
      },
      {
        id: 'ice-cube-carving',
        name: 'Ice Cube Carving',
        description: 'Utility knife smoothly carving translucent ice with melting effects',
        prompt: 'Realistic 4K footage close-up of a razor-sharp utility knife smoothly carving a large, translucent ice cube on a chilled, brushed metal tray. It melts slowly, creating tiny water droplets. The inside of the ice cube is also solid, clear ice. The sound is ASMR style.'
      }
    ]
  },
  {
    id: 'nature',
    name: 'Natural Environment',
    icon: '🌿',
    types: [
      {
        id: 'rain-window',
        name: 'Rain on Window',
        description: 'Raindrops hitting window with sliding water droplets',
        prompt: 'Close-up of raindrops hitting window glass with sliding water droplets and atmospheric lighting. Camera: Macro lens capturing water droplet formation and movement. Lighting: Soft natural lighting from window. Audio: Gentle rain tapping, water sliding sounds, and peaceful ambient atmosphere.'
      },
      {
        id: 'forest-rain',
        name: 'Forest Rain',
        description: 'Rain falling on leaves in a lush forest',
        prompt: 'Serene forest scene with rain falling on lush green leaves and forest floor. Camera: Various angles capturing rain droplets on leaves and ground. Lighting: Natural forest lighting filtered through canopy. Audio: Gentle rain on leaves, distant thunder, forest ambiance, and peaceful nature sounds.'
      },
      {
        id: 'rain-umbrella',
        name: 'Rain on Umbrella',
        description: 'Close-up rain drops hitting umbrella surface',
        prompt: 'Intimate view of rain droplets hitting umbrella surface with water running down edges. Camera: Overhead and side angles capturing water patterns. Lighting: Soft overcast lighting. Audio: Rhythmic rain tapping on umbrella fabric, water dripping, and ambient rain sounds.'
      },
      {
        id: 'ocean-waves',
        name: 'Ocean Waves',
        description: 'Gentle waves lapping against the shore',
        prompt: 'Peaceful ocean scene with gentle waves lapping against sandy shore and rocks. Camera: Low angle capturing wave movement and foam patterns. Lighting: Natural beach lighting with sun reflections. Audio: Soft wave sounds, water flowing over rocks, and distant ocean ambiance.'
      },
      {
        id: 'fireplace',
        name: 'Fireplace Crackling',
        description: 'Wood burning with crackling sounds and visual flames',
        prompt: 'Warm close-up of wooden logs burning in stone fireplace with dancing orange flames. Camera: Steady shot focusing on flame movement and glowing embers. Lighting: Natural fire lighting creating warm ambiance. Audio: Wood crackling, logs settling, gentle popping sounds, and soft whooshing of flames.'
      },
      {
        id: 'flowing-water',
        name: 'Flowing Water',
        description: 'Water flowing over stones and rocks',
        prompt: 'Serene water stream flowing over smooth stones and rocks in natural setting. Camera: Various angles capturing water movement and stone textures. Lighting: Natural outdoor lighting with water reflections. Audio: Gentle water flowing, bubbling sounds, and peaceful stream ambiance.'
      },
      {
        id: 'forest-ambiance',
        name: 'Forest Ambiance',
        description: 'Bird songs, wind through leaves, and nature sounds',
        prompt: 'Peaceful forest environment with sunlight filtering through trees and gentle wind movement. Camera: Steady shots of forest canopy and tree details. Lighting: Natural dappled sunlight through leaves. Audio: Bird songs, wind through leaves, rustling sounds, and serene nature ambiance.'
      }
    ]
  },
  {
    id: 'objects',
    name: 'Object Interaction',
    icon: '🔊',
    types: [
      {
        id: 'wood-tapping',
        name: 'Wood Tapping',
        description: 'Gentle tapping on wooden surfaces',
        prompt: 'Close-up of fingers gently tapping on various wooden surfaces with different textures. Camera: Macro lens capturing finger movement and wood grain. Lighting: Warm lighting highlighting wood textures. Audio: Soft wooden tapping sounds, finger nail clicks, and rhythmic patterns.'
      },
      {
        id: 'metal-tapping',
        name: 'Metal Tapping',
        description: 'Soft tapping on metal objects',
        prompt: 'Detailed view of fingers tapping on various metal objects and surfaces. Camera: Close-up capturing finger movements and metal reflections. Lighting: Clean lighting highlighting metal surfaces. Audio: Gentle metallic tapping, resonant sounds, and rhythmic metal percussion.'
      },
      {
        id: 'glass-tapping',
        name: 'Glass Tapping',
        description: 'Delicate tapping on glass surfaces',
        prompt: 'Artistic view of fingers delicately tapping on various glass surfaces and objects. Camera: Macro lens capturing finger precision and glass clarity. Lighting: Bright lighting creating glass reflections. Audio: Crystal clear glass tapping, resonant chimes, and delicate percussion sounds.'
      },
      {
        id: 'texture-scratching',
        name: 'Texture Scratching',
        description: 'Scratching different textured materials',
        prompt: 'Close-up of fingers scratching various textured materials including fabric, wood, and stone. Camera: Macro lens capturing texture details and finger movement. Lighting: Directional lighting emphasizing texture patterns. Audio: Diverse scratching sounds, material friction, and tactile audio textures.'
      },
      {
        id: 'page-turning',
        name: 'Page Turning',
        description: 'Turning book pages with paper rustling sounds',
        prompt: 'Intimate view of hands turning pages in an old book with visible paper texture. Camera: Close-up capturing page movement and paper details. Lighting: Soft reading light creating paper shadows. Audio: Gentle page turning, paper rustling, book spine sounds, and quiet reading ambiance.'
      },
      {
        id: 'package-unwrapping',
        name: 'Package Unwrapping',
        description: 'Unwrapping paper and plastic packages',
        prompt: 'Detailed view of hands carefully unwrapping packages with various materials including paper, plastic, and tape. Camera: Close-up capturing unwrapping motion and material textures. Lighting: Clean lighting highlighting package details. Audio: Paper crinkling, plastic rustling, tape peeling, and satisfying unwrapping sounds.'
      },
      {
        id: 'small-objects',
        name: 'Small Objects',
        description: 'Arranging wooden blocks, beads, and small items',
        prompt: 'Artistic arrangement of small wooden blocks, beads, and miniature objects on clean surface. Camera: Overhead and close-up angles capturing object details. Lighting: Soft ambient lighting highlighting object textures. Audio: Gentle object placement, wooden clicks, bead rolling, and quiet arrangement sounds.'
      },
      {
        id: 'keyboard',
        name: 'Keyboard Typing',
        description: 'Gentle typing sounds on different keyboards',
        prompt: 'Professional close-up of fingers typing on premium mechanical keyboard with individual key switches. Camera: Side and overhead angles capturing finger precision and key movement. Lighting: Clean desk lighting highlighting keyboard details. Audio: Satisfying tactile clicks, key depression sounds, typing rhythm patterns.'
      },
      {
        id: 'squeeze-toy',
        name: 'Squeeze Toy ASMR',
        description: 'Gentle squeezing of soft stress toys and squishy objects',
        prompt: 'Close-up of hands gently squeezing various colorful stress balls, squishy toys, and foam objects on a soft white surface. Camera: Macro lens capturing finger pressure and object deformation. Lighting: Soft ambient lighting highlighting toy textures and colors. Audio: Gentle squishing sounds, soft compression noises, and satisfying stress ball manipulation sounds.'
      }
    ]
  },
  {
    id: 'industrial',
    name: 'Industrial & Crafts',
    icon: '🔨',
    types: [
      {
        id: 'hot-iron',
        name: 'Hot Iron Forging',
        description: 'Industrial blade cutting glowing hot metal with sparks and heat',
        prompt: 'Close-up of glowing red-hot metal being shaped by blacksmith hammer on anvil. Camera: Side angle capturing hammer strikes and sparks flying. Lighting: Dramatic forge lighting with glowing metal illumination. Audio: Rhythmic hammer strikes, metal ringing, crackling fire, and sizzling sounds of hot metal cooling.'
      },
      {
        id: 'metal-sheet-cutting',
        name: 'Metal Sheet Cutting',
        description: 'Heavy-duty shears slicing through gleaming metal sheets',
        prompt: 'Realistic 4K footage close-up of a heavy-duty metal shear effortlessly slicing a gleaming silver aluminum sheet on a worn, industrial steel workbench. It bends and curls with a resonant clang. The inside of the aluminum sheet is also smooth, polished metal. The sound is ASMR style.'
      },
      {
        id: 'electronic-device-cutting',
        name: 'Electronic Device Dissection',
        description: 'Precision knife carefully dissecting electronic devices revealing circuits',
        prompt: 'Realistic 4K footage close-up of a precision utility knife gently dissecting a sleek black smartphone on an anti-static white mat. It reveals intricate circuit boards and tiny components. The inside of the smartphone is also complex electronic circuitry. The sound is ASMR style.'
      },
      {
        id: 'minecraft-block-breaking',
        name: 'Minecraft Block Breaking',
        description: 'Pixelated tools breaking cubic blocks with crumbling pixel effects',
        prompt: 'Realistic 4K footage close-up of a blocky diamond pickaxe crisply breaking a pixelated dirt block on a stylized grassy terrain. It crumbles into smaller pixel fragments. The inside of the dirt block is also textured brown pixels. The sound is ASMR style.'
      }
    ]
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    icon: '💆',
    types: [
      {
        id: 'hair-brushing',
        name: 'Hair Brushing',
        description: 'Hair cutting, washing, brushing, and blow drying',
        prompt: 'Relaxing hair care routine with brushing, washing, and styling. Camera: Close-up capturing hair movement and brush strokes. Lighting: Soft beauty lighting highlighting hair texture. Audio: Gentle brushing sounds, water flowing, hair movement, and peaceful grooming ambiance.'
      },
      {
        id: 'nail-care',
        name: 'Nail Care',
        description: 'Nail trimming, polishing, and hand massage',
        prompt: 'Detailed view of manicure process with nail file shaping fingernails on elegant hands. Camera: Macro lens capturing nail texture and filing motion. Lighting: Soft beauty lighting highlighting hand elegance. Audio: Gentle filing sounds, nail clippers clicking, cuticle care, and soft brushing noises.'
      },
      {
        id: 'medical-exam',
        name: 'Medical Examination',
        description: 'Gentle medical checkup with stethoscope sounds',
        prompt: 'Professional medical examination scene with gentle checkup procedures using stethoscope and medical tools. Camera: Close-up capturing medical instruments and gentle movements. Lighting: Clean clinical lighting. Audio: Stethoscope sounds, gentle medical procedures, and calming healthcare ambiance.'
      }
    ]
  },
  {
    id: 'relaxation',
    name: 'Sleep & Relaxation',
    icon: '😴',
    types: [
      {
        id: 'white-noise',
        name: 'White Noise',
        description: 'Fan sounds, air conditioner, and ambient noise',
        prompt: 'Calming white noise environment with fan rotating and air conditioning ambiance. Camera: Steady shots of fan movement and ambient lighting. Lighting: Soft ambient lighting creating peaceful atmosphere. Audio: Consistent fan sounds, air conditioner humming, and relaxing white noise patterns.'
      },
      {
        id: 'guided-relaxation',
        name: 'Guided Relaxation',
        description: 'Soft-spoken relaxation and meditation guidance',
        prompt: 'Peaceful meditation environment with soft ambient lighting and calming visuals. Camera: Steady, serene shots creating meditative atmosphere. Lighting: Warm, dim lighting promoting relaxation. Audio: Gentle guided meditation, soft-spoken relaxation instructions, and peaceful ambient sounds.'
      },
      {
        id: 'rhythmic-sounds',
        name: 'Rhythmic Sounds',
        description: 'Regular gentle tapping and rhythmic patterns',
        prompt: 'Artistic arrangement creating gentle rhythmic patterns with various soft objects. Camera: Close-up capturing rhythmic movements and pattern details. Lighting: Soft ambient lighting highlighting rhythmic motion. Audio: Regular gentle tapping, rhythmic patterns, and soothing repetitive sounds.'
      }
    ]
  }
] 