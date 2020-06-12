import { presetPalettes } from '@ant-design/colors';

// Design only for 13 colors
export const colors = Object.keys(presetPalettes)
                            .map(key => presetPalettes[key].primary)
                            .sort(() => Math.random() - 0.5);

//const matrix = Object.values(presetPalettes);
//export const colors = matrix[0].map((x, i) => matrix.map(y => y[i])).flat();
