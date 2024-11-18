import React, { useEffect, useState } from "react";
import {TreeTaxonomyProps} from "../types";
const LazyTreeNode = React.lazy(() => import('./TreeNodeComponent'));

/**
 * Tree Component
 * A React component that renders hierarchical tree data with search feature 
 * Features:
 * - Debounce mechanism to optimize search 
 * - Fetchdata method to fetch the taxonomy data from the mock api
 * - Searchdata method to search and filter by names, common_names, taxons
 * - custom clicks and styles are added
 */
const TreeComponent:React.FC = React.memo(() => {
    const [data, setData] = useState<TreeTaxonomyProps[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [debounce, setDebounce] = useState('')
    const [error, setError] = useState<string | null>(null)

    /**
     * This is to expand the intial node on page load
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
     * Custom onClick function that logs the clicked node's details
     *
     * @param {TreeTaxonomyProps} node
     */
    const handleNodeClick = (node: TreeTaxonomyProps) => {
        console.log('Node clicked:', node);
    };

    /**
     * fetchData()
     * Asynchronously fetches the taxonomy data from a mock API. We need to change only the url once we get it from the backend
     * @async
     */
    const fetchData = async() => {
        setError(null)
        try {
            const response = await fetch('../../mock-data/taxonomy.json')
            if(!response || !response.ok) {
                throw new Error('Response is not ok');
            }
            const result:TreeTaxonomyProps[] = await response.json()
            setData(result)
        } catch(err) {
            console.log('Error:', err)
            setError("failed to load the data")
            throw err
        }
    }

    
    /**
     * Custom styles are added here
     *
     * @type {{}}
     */
    const treeStyles = {
        // add css properties here
    }

    /**
     * searchData()
     * Function to search and filter parent nodes. name, common_name and taxon is changed to lowercase and checked with debouce value. 
     * Debounce ensures to trigger the function only user stops typing in the filed
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

    // Returns an error, when the fetch fails
    if(error) {
        return <div>Error: {error}</div>
    }

    return (
        <div>
            <div style={{margin: "10px"}}>
                <label htmlFor="searchField">Search node: </label>
                <input type="text" placeholder="Search query" style={{fontSize: '16px'}} name="searchField" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
            </div>
            {searchData(data).map((child) => (
                <LazyTreeNode key={child.taxon} node={child} initialOpenNodes={initialOpenNodes} 
                onClick={handleNodeClick} style={treeStyles}/>
            ))}
        </div>
    )
})

export default TreeComponent