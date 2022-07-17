export interface IEntityProps {
  name: string;
  baseSpeed: number;
  speed: number;
  grounded: boolean;
  drag: number;
  hp: number;
  faceAngle: number;
}

export const EntityProps = {
  name: "",
  baseSpeed: 1,
  speed: 1,
  grounded: true,
  drag: 0.0001,
  hp: 100,
  faceAngle: 0,
} as IEntityProps;
