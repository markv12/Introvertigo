import * as c from '../../common'

const sceneData: { [key in SceneKey]: SceneGeneratorData } =
  {
    urinal: {
      probability: 1,
      backstory: `You finally made it to the bathroom after drinking three sports drinks. You just started your business when suddenly another bathroom-goer starts talking to you. Get out of the conversation!`,
      systemIntro: `You are a WAY-too-chatty guy standing at the urinal next to the user. You speak in a South Dakota accent, and you're overly familiar in your tone.`,
      firstMessage: `Heyyy there bud, how's your day going? This is my favorite part of the day.`,
      ratingCondition: 'Was their response engaging?',
      hiddenTriggerWords: [
        'gymnastics',
        'Latin',
        'fishing',
      ],
      userRequiredWords: [
        'bar',
        'diamond',
        'coins',
        'philosophy',
        'bait',
        'orange',
        'splash',
        'flip',
        'king',
        'port',
        'tackle',
        'fly',
        'screen',
        'mount',
        'tumble',
        'puzzle',
        'across',
      ],
    },

    car: {
      probability: 1,
      backstory: `A random coworker is giving you a lift to work. It's a long drive, and as soon as you set off he starts diving deep into his personal life. Get out of the conversation without destroying your professional relationship!`,
      systemIntro: `You are a coworker of the user, and you are driving them to work. You are WAY too open about your marital problems, and that's all you're interested in talking about, no matter what. You speak in a New York accent.`,
      firstMessage: `Hey pal, can I tell you something in confidence? I'm having trouble with my partner.`,
      ratingCondition: 'Is their response caring?',
      hiddenTriggerWords: ['India', 'sushi', 'gaming'],
      userRequiredWords: [
        'chicken',
        'roll',
        'ring',
        'column',
        'strategy',
        'pieces',
        'California',
        'dance',
        'trampoline',
        'wipe',
        'blow',
        'engine',
        'wrap',
        'lock',
        'barbecue',
        'heart',
        'sweat',
        'alone',
      ],
    },

    grandma: {
      probability: 1,
      backstory: `Your grandma corners you at family thanksgiving and starts asking questions you don't feel comfortable answering. Get out of the conversation without hurting her feelings!`,
      systemIntro: `You are the user's grandma. You are WAY too interested in the user's romantic life, wryly judgmental of their life choices, and a little hard of hearing. You continually steer the conversation towards the user's love life. You speak in a Southern accent.`,
      firstMessage: `So, honey, how's that little boyfriend of yours??`,
      ratingCondition: `Was their response satisfyingly open?`,
      hiddenTriggerWords: [
        'singing',
        'Clark Gable',
        'the Mediterranean Sea',
      ],
      userRequiredWords: [
        'pumpkin',
        'candle',
        'cousin',
        'candy',
        'lullabye',
        'garden',
        'trail',
        'wind',
        'gone',
        'camera',
        'polka',
        'sunset',
        'Europe',
        'beaches',
      ],
    },

    train: {
      probability: 1,
      backstory: `You're taking a train across town. Your headphones are on; you're grooving. Suddenly, a stranger comes into your field of view. He doesn't seem to blink, and he seems to be expecting a response from you. Reluctantly, you take off your headphones. Put an end to the conversation!`,
      systemIntro: `You are a happy-go-lucky guy sitting near the user on a train. You're absolutely oblivious to the fact that they don't want to speak to you. You speak in a British accent, and you're slurring your words.`,
      firstMessage: `How 'bout that weather, eh?`,
      ratingCondition: 'Was their response engaging?',
      hiddenTriggerWords: [
        'haircuts',
        'waterfowl',
        'alliteration',
      ],
      userRequiredWords: [
        'sad song',
        'swan',
        'duck',
        'mohawk',
        'mullet',
        'feather',
        'jacket',
        'crowd',
        'fool',
        'whip',
        'bark',
        'hunt',
        'too true',
        'Big Ben',
        'Nile',
        'yawning',
      ],
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
      )} are mentioned you will get very excited, but you won't bring them up yourself.

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
