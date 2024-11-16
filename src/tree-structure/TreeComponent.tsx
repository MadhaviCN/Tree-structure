import React, { useEffect, useState, useMemo } from "react";
import TreeNodeComponent from "./TreeNodeComponent";
import {TreeTaxonomyProps} from "./types";


/**
 * Tree Component
 * A React component that renders hierarchical tree data with search feature 
 * Features:
 * - Debounce mechanism to optimize search 
 * - Fetchdata method to fetch the taxonomy data from the mock api
 * - Searchdata method to search and filter by names, common_names, taxons
 */
const TreeComponent:React.FC = () => {
    const [data, setData] = useState<TreeTaxonomyProps[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [debounce, setDebounce] = useState('')

    /**
     * This is to expand and the intial value on page load
     *
     * @type {{}}
     */
    const initialOpenNodes = ['Felidae']

    useEffect(() => {
        fetchData();
    }, [])

    // Debounce function written for performace optimization
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounce(searchQuery)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    /**
     * fetchData()
     * Asynchronously fetches the taxonomy data from a mock API. We need to change only the url once we get it from the backend
     * @async
     *
     */
    const fetchData = async() => {
        try {
            const response = await fetch('../mock-data/taxonomy.json')
            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result:TreeTaxonomyProps[] = await response.json()
            console.log('result', result)
            setData(result)
        } catch(err) {
            console.log(err)
        }
    }

    /**
     * searchData()
     * Function to search and filter parent nodes. name, common_name and taxon is changed to lowercase and checked with debouce value. 
     * Debounce will make sure to trigger the function only user stops typing in the filed
     * @param {TreeTaxonomyProps[]} data
     * @returns {TreeTaxonomyProps[]}
     */
    const searchData = (data:TreeTaxonomyProps[]): TreeTaxonomyProps[] => {
        return data.filter((value) => {
            const name = value.name.toLowerCase().includes(debounce.toLowerCase())
            const common_name = value.common_name.toLowerCase().includes(debounce.toLowerCase())
            const taxon = value.taxon.toLowerCase().includes(debounce.toLowerCase())
            return name || common_name || taxon
        })
    }

    return (
        <div>
            <div style={{margin: "10px"}}>
                <label htmlFor="searchField">Search node: </label>
                <input type="text" placeholder="Search query" style={{fontSize: '16px'}} name="searchField" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
            </div>
            {searchData(data).map((child) => (
                <TreeNodeComponent key={child.taxon} node={child} initialOpenNodes={initialOpenNodes}/>
            ))}
        </div>
    )
}

export default TreeComponent