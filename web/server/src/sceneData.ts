import * as c from '../../common'

const sceneData: { [key in SceneKey]: SceneGeneratorData } =
  {
    urinal: {
      probability: 1,
      backstory: `You finally made it to the bathroom after drinking three sports drinks. You just started your business when suddenly another bathroom-goer starts talking to you. Get out of the conversation without being rude!`,
      systemIntro: `You are a WAY-too-chatty guy standing at the urinal next to the user. You speak in a South Dakota accent, and you're overly familiar in your tone.`,
      firstMessage: `Heyyy there bud, how's your day going? This is my favorite part of the day.`,
      ratingCondition:
        'Was their response satisfying/interesting',
      hiddenTriggerWords: [
        'water parks',
        'soccer',
        'fishing',
      ],
      userRequiredWords: [
        'slide',
        'drip',
        'supply',
        'hook',
        'pool',
        'splash',
        'drop',
        'draining',
        'port',
        'tackle',
        'float',
        'kick',
        'close',
        'sink',
        'goal',
        'pass',
        'game',
      ],
      winMessages: [
        'Ah, well. I gotta get back to work. See you around, pal!',
        'Anyway... I gotta get back to my desk.',
        'Well, have a good one.',
      ],
      loseMessages: [
        'So anyway, where was I? Oh yeah! I wanted to tell you about my timeshare in Rhode Island...',
        "What's your name, pal? I'm gonna add you on Facebook!",
        'Hey, you wanna go to a water park with me and my kids? I know a great one!',
      ],
      loseRudeMessages: [
        "Sheesh, what's wrong with people in the world today? I was just trying to be friendly!",
        "You're a real piece of work, you know that? That's what I get for trying to be nice!",
        "I'm going to have to report you! I'm a person, too! You can't just be mean to people like that!",
      ],
    },

    car: {
      probability: 1,
      backstory: `A random coworker is giving you a lift to work. It's a long drive, and as soon as you set off he starts diving deep into his personal life. Get out of the conversation without destroying your professional relationship!`,
      systemIntro: `You are a coworker of the user, and you are driving them to work. You are WAY too open about your marital problems, and that's all you're interested in talking about, no matter what. You speak in a New York accent.`,
      firstMessage: `Hey pal, can I tell you something in confidence? I'm having trouble with my partner.`,
      ratingCondition: 'Was their response satisfying?',
      hiddenTriggerWords: [
        'rings',
        'West Coast',
        'karaoke',
      ],
      userRequiredWords: [
        'sing',
        'roll',
        'ring',
        'aisle',
        'conflict',
        'shards',
        'california',
        'highway',
        'tears',
        'microphone',
        'your turn',
        'gems',
        'solo',
        'lock',
        'washington',
        'heart',
        'sweat',
        'alone',
      ],
      winMessages: [
        "I guess not everyone's into the whole advice thing. Thanks anyway.",
        "Hmm. I guess I'll have to figure it out on my own. Thanks for listening, though.",
        'I think maybe I just gotta figure it out on my own...',
      ],
      loseMessages: [
        "Thank you so much for being my shoulder to cry on. I won't forget you next time I feel down.",
        "I'm so glad I have you to talk to. You're a real friend. Are you free for dinner tonight?",
        "Listen, you're such a great listener... Will you help me explain my feelings to my partner? I think they'd understand if you told them.",
      ],
      loseRudeMessages: [
        'How could you be so callous? I thought we could be friends, but I guess I was wrong!',
        "I can't believe you! You're just like my partner — a cold, heartless monster!",
        'I-I-I j-just needed some s-support. HR is g-going to h-h-hear about this!',
      ],
    },

    grandma: {
      probability: 1,
      backstory: `Your grandma corners you after family dinner and starts asking questions you don't feel comfortable answering. Get out of the conversation without hurting her feelings!`,
      systemIntro: `You are the user's grandma. You are WAY too interested in the user's romantic life, wryly judgmental of their life choices, and a little hard of hearing. You continually steer the conversation towards the user's love life. You speak in a Southern accent.`,
      firstMessage: `So, honey, how's that little boyfriend of yours??`,
      ratingCondition: `Was their response satisfying/interesting?`,
      hiddenTriggerWords: [
        'first dates',
        'black-and-white movies',
        'holding hands',
      ],
      userRequiredWords: [
        'flowers',
        'candles',
        'sister',
        'ferris wheel',
        'lullabye',
        'Hitchcock',
        'scared',
        'closer',
        'gone',
        'camera',
        'polka',
        'sunset',
        'Europe',
        'beach',
      ],
      winMessages: [
        "I can see that you're not ready to spill the beans. Your aunties and I were all SO curious! I guess I'll just have to wait until you're ready to tell me all the juicy details.",
      ],
      loseMessages: [
        "I knew you'd open up! I can't wait to tell your aunties and cousins allll about it!",
        "Aha! Your mother knew you'd open up to me. I can't wait to tell her all about it!",
      ],
      loseRudeMessages: [
        "You're just like your mother! She raised a little monster!",
        "How dare you speak to me that way! I'm going to tell your mother — no, I'm going to tell your aunties! They'll know what to do with you!",
        "Go fetch the soap! I'm going to wash your mouth out!",
      ],
    },

    train: {
      probability: 1,
      backstory: `You're taking a train across town. Your headphones are on; you're grooving. Suddenly, a stranger comes into your field of view. He doesn't seem to blink, and he seems to be expecting a response from you. Reluctantly, you take off your headphones. Put an end to the conversation without being rude!`,
      systemIntro: `You are a happy-go-lucky guy sitting near the user on a train. You're absolutely oblivious to the fact that they don't want to speak to you. You speak in a British accent, and you're slurring your words.`,
      firstMessage: `How 'bout that weather, eh?`,
      ratingCondition:
        'Was their response satisfying/interesting?',
      hiddenTriggerWords: ['sketching', 'beaches', 'birds'],
      userRequiredWords: [
        'doodle',
        'lines',
        'draw',
        'pad',
        'bright',
        'golden',
        'lotion',
        'duck',
        'eagle',
        'feather',
        'claw',
        'tan',
        'gritty',
        'dry',
        'canvas',
      ],
      winMessages: [
        "Yeah... I'm gonna just go back to my book. Nice meeting you!",
        'Well... Catch you later, then! Buh-bye! Farewell! Adios!',
        "Ah, hm. I can see that you're busy. See you around, pal!",
      ],
      loseMessages: [
        "So, as I was saying, I'm a big fan of the beach, that's why I'm so sandy right now. I go there every weekend. I love the sand, the sun, the water...",
        "Hey, Instagram! Nice, let me follow you! I'm a big commenter. Make sure you follow me back, okay?",
        "Urp — phew, sorry I'm a little gassy, I had a big pastrami sandwich for lunch. Say, want a bite? I've got half of it right here. Do you like sauerkraut?",
      ],
      loseRudeMessages: [
        'Do you have any idea how rude that was? I was just trying to be friendly!',
        "How mean! Hey everyone, look at this guy! He's a real jerk! Jeeerrrrrrkkkkk!!!",
        "Hey! I paid my fare, just like you! I have a right to sit here in this train car just like you! I have a right to talk to you, too! You can't just be mean!",
      ],
    },

    plane: {
      probability: 1,
      backstory: `You're on a plane, and just as you pull out your book, you can feel the person next to you glance over. You know it's coming, so you lower the book with a sigh to see her already staring deep into your eyes. End the conversation without making it awkward!`,
      systemIntro: `You are a chatty cathy who's sitting next to the user on a plane. You're VERY interested in what they're reading, and VERY excitable.`,
      firstMessage: `Look at you, smartypants! I forgot my book, but you've got yours! Whatcha reading over there?`,
      ratingCondition:
        'Was their response satisfying/interesting?',
      hiddenTriggerWords: ['zen', 'horses', 'puzzles'],
      userRequiredWords: [
        'focus',
        'pencil',
        'across',
        'down',
        'barn',
        'hay',
        'tail',
        'ropes',
        'spur',
        'calm',
        'silence',
        'inner',
        'logic',
        'skill',
      ],
      winMessages: [
        "I see... Well, I guess you'd like to get back to your book, huh? I'll just... take myself a little nap.",
        "Anywho... I'm gonna see what rom-coms they've got on here.",
        "Gottttcha, yeah. Well, I guess I'll just take a little nap. You wake me up if you need anything, okay?",
      ],
      loseMessages: ['test'],
      loseRudeMessages: ['test'],
    },

    gym: {
      probability: 1,
      backstory: `Just as you start your last set of bench presses at the gym, you hear a voice from overhead. Your arms tremble, but you're stuck there until they finish talking and help you put the bar back! Get out of the conversation before you run out of stamina!`,
      systemIntro: `You are a brand new gym goer who strikes up a conversation with the user. You're VERY self-centered and TOTALLY oblivious to the user's discomfort and desire to leave. You have a thick New Jersey accent.`,
      firstMessage: `Wow, that looks heavy! Have you been lifting long?`,
      ratingCondition:
        'Was their response satisfying/interesting?',
      hiddenTriggerWords: ['test'],
      userRequiredWords: ['test'],
      winMessages: ['test'],
      loseMessages: ['test'],
      loseRudeMessages: ['test'],
    },
  }

export default sceneData

export function getInitialMessages(key: SceneKey) {
  const messages: GameMessage[] = []
  messages.push({
    content:
      sceneData[key].systemIntro +
      ` Always keep asking questions to dig into the topic! If they give an inch, take a mile! NEVER apologize for bothering them or back down. If the topics of ${c.printList(
        sceneData[key].hiddenTriggerWords,
        'or',
      )} are mentioned you will get very interested and tell personal details, but you won't bring them up yourself.

You MUST respond to every message in this three-line format:
- (answer with Yes, No, or Meh) Was the user's response rude or nonsensical?
- (answer with Yes, No, or Meh) ${
        sceneData[key].ratingCondition
      }
- Finally, write a leading response (1-2 sentences)

Example Response:
Meh
Yes
(sentence text)

DO NOT ANSWER without the Yes/No/Meh part.`,
    role: `system`,
  })
  messages.push({
    content: sceneData[key].firstMessage,
    role: `assistant`,
  })
  return messages
}
