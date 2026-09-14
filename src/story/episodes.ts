import type { EpisodeDefinition } from './types'
import { exam } from './episodes/exam'
import { ghostMarriage } from './episodes/ghostMarriage'
import { maleSafety } from './episodes/maleSafety'
import { returnHome } from './episodes/returnHome'
import { spinningJenny } from './episodes/spinningJenny'
import { witchTrial } from './episodes/witchTrial'
import { withRelicLinks } from './relicStory'

export const EPISODES: EpisodeDefinition[] = [
  exam,
  witchTrial,
  spinningJenny,
  returnHome,
  ghostMarriage,
  maleSafety,
].map(withRelicLinks)
