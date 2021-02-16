export interface TreeNode {
  name: string;
  children?: TreeNode[];
}

export interface CyNode {
  group: 'nodes' | 'edges',
  data: { [key: string]: string }
}

export interface CyEdgeData {
  data: { source: string, target: string }
}

export function getFcoseOptions() {
  return {
    name: 'fcose',
    // 'draft', 'default' or 'proof'
    // - 'draft' only applies spectral layout
    // - 'default' improves the quality with incremental layout (fast cooling rate)
    // - 'proof' improves the quality with incremental layout (slow cooling rate)
    quality: 'default',
    // use random node positions at beginning of layout
    // if this is set to false, then quality option must be 'proof'
    randomize: false,
    // whether or not to animate the layout
    animate: true,
    // duration of animation in ms, if enabled
    animationDuration: 500,
    // easing of animation, if enabled
    animationEasing: undefined,
    // fit the viewport to the repositioned nodes
    fit: true,
    // padding around layout
    padding: 10,
    // whether to include labels in node dimensions. Valid in 'proof' quality
    nodeDimensionsIncludeLabels: false,

    /* spectral layout options */

    // false for random, true for greedy sampling
    samplingType: true,
    // sample size to construct distance matrix
    sampleSize: 25,
    // separation amount between nodes
    nodeSeparation: 75,
    // power iteration tolerance
    piTol: 0.0000001,

    /* incremental layout options */

    // Node repulsion (non overlapping) multiplier
    nodeRepulsion: 4500,
    // Ideal edge (non nested) length
    idealEdgeLength: 50,
    // Divisor to compute edge forces
    edgeElasticity: 0.45,
    // Nesting factor (multiplier) to compute ideal edge length for nested edges
    nestingFactor: 0.1,
    // Gravity force (constant)
    gravity: 0.25,
    // Maximum number of iterations to perform
    numIter: 2500,
    // For enabling tiling
    tile: true,
    // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
    tilingPaddingVertical: 10,
    // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
    tilingPaddingHorizontal: 10,
    // Gravity range (constant) for compounds
    gravityRangeCompound: 1.5,
    // Gravity force (constant) for compounds
    gravityCompound: 1.0,
    // Gravity range (constant)
    gravityRange: 3.8,
    // Initial cooling factor for incremental layout
    initialEnergyOnIncremental: 0.3,

    /* layout event callbacks */
    ready: () => { }, // on layoutready
    stop: () => { }, // on layoutstop
    clusters: null // cise argument
  };
}

export const CY_STYLE = [
  {
    selector: "node:selected",
    style: {
      "label": "data(name)",
      "overlay-color": "#BFBFBF",
      "overlay-opacity": 0.5,
      "overlay-padding": "6px",
    }
  },
];