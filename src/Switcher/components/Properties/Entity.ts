export interface IEntityProps {
  name: string;
  baseSpeed: number;
  speed: number;
  hp: number;
}

export const EntityProps = {
  name: "",
  baseSpeed: 1,
  speed: 1,
  hp: 100,
} as IEntityProps;
