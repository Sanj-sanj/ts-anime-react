import { ListDetails, UserShowStatus } from "./UserPreferencesTypes";
import { ValidFormats } from "./initialConfigTypes";

export interface APIPayload {
  data: {
    Page: {
      media: MainCard[] | NewEpisodeCards[];
      pageInfo: {
        currentPage: number;
        hasNextPage: boolean;
        lastPage: number;
        perPage: number;
        total: number;
      };
      airingSchedules?: AiringSchedule[];
    };
  };
  errors?: {
    locations: { line: number; column: number }[];
    message: string;
    status: number;
  }[];
}

export type APIVariables = NearestSeason | OngoingSeason;
type NearestSeason = {
  page: number;
  perPage: number;
  hasNextPage: boolean;
  season: Season;
  seasonYear: number;
  format: ValidFormats;
  format_in: Formats;
};
type OngoingSeason = {
  page: number;
  perPage: number;
  hasNextPage: boolean;
  format_in: Formats;
  format: ValidFormats;
  status_in: ShowStatus[];
};
export type APICalendarLast24Hours = {
  page: number;
  perPage: number;
  airingAt_greater: number;
  airingAt_lesser: number;
};
export type APINewEpisodesVariables = {
  page: number;
  perPage: number;
  id_in: number[];
};

const TVformat = ["TV", "TV_SHORT"] as const
const MOVIEformat = ["MOVIE", "SPECIAL"] as const
const OVAformat = ["ONA", "OVA"] as const

export type Formats = (typeof TVformat) | (typeof MOVIEformat) | (typeof OVAformat)

export type StudioNode = {
  name: string;
  isAnimationStudio: boolean;
  favourites: number;
};

export type NextAiringEpisode = {
  airingAt: number;
  episode: number;
  timeUntilAiring: number;
} | null;

export type Titles = {
  romaji: string | null;
  english: string | null;
  native: string | null;
};
export type CoverImage = {
  color: string | null;
  large: string | null;
  medium: string | null;
};
export type Season = "WINTER" | "SPRING" | "SUMMER" | "FALL";
export type ShowStatus =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELED"
  | "HIATUS"
  | null;

export type SourceMaterial =
  | "ORIGINAL"
  | "MANGA"
  | "LIGHT_NOVEL"
  | "VISUAL_NOVEL"
  | "VIDEO_GAME"
  | "OTHER"
  | "NOVEL"
  | "DOUJINSHI"
  | "ANIME"
  | "WEB_NOVEL"
  | "LIVE_ACTION"
  | "GAME"
  | "COMIC"
  | "MULTIMEDIA_PROJECT"
  | "PICTURE_BOOK";

export interface NewEpisodeCards {
  id: number;
  title: Titles;
  status: ShowStatus;
  episodes: number | null;
  nextAiringEpisode: NextAiringEpisode;
}
export type UserListData = {
  userListDetails: ListDetails;
  apiResults: MainCard;
}[];
export type UserListParams = { [x in UserShowStatus]: UserListData };
export type AiringSchedule = {
  airingAt: number;
  id: number;
  media: MainCard;
  episode: number;
};
export interface MainCard {
  meanScore: number | null;
  nextAiringEpisode: NextAiringEpisode;
  genres: string[];
  id: number;
  status: ShowStatus;
  season: Season;
  type: string | null;
  trending: number | null;
  seasonYear: number;
  coverImage: CoverImage;
  title: Titles;
  studios: { nodes: StudioNode[] | null };
  format: Formats[0];
  popularity?: number;
  episodes?: number;
  duration?: number;
  modNotes?: string;
  description?: string;
  source?: SourceMaterial;
  startDate?: {
    day: number | null;
    month: number;
    year: number;
  };
  endDate?:
    | {
        day: number;
        month: number;
        year: number;
      }
    | {
        day: null;
        month: null;
        year: null;
      };
}
