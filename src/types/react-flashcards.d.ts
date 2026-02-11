declare module "react-flashcards" {
  import { CSSProperties } from "react";

  export interface Card {
    id: number | string;
    front: string;
    back: string;
    [key: string]: any;
  }

  export interface FlashCardArrayProps {
    cards: Card[];
    width?: string | number;
    height?: string | number;
    label?: string;
    timerDuration?: number;
    FlashcardArrayStyle?: CSSProperties;
    frontStyle?: CSSProperties;
    backStyle?: CSSProperties;
    onCardChange?: (id: string | number, index: number) => void;
    [key: string]: any;
  }

  export const FlashCardArray: React.FC<FlashCardArrayProps>;
}
