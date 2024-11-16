/**
 * It represent the properties of Taxonomy data
 * Nodes:
 * taxon {string}
 * name {string}
 * common_name {string}
 * children {TaxonomyProps}
 * @export
 * @interface TreeTaxonomyProps
 * @typedef {TreeTaxonomyProps}
 */
export interface TreeTaxonomyProps {
    taxon: string,
    name: string,
    common_name: string,
    children: TreeTaxonomyProps[]
}