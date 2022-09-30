import { useEffect, useState } from 'react';
import searchAndReplaceData from '../data/searchAndReplaceData.json';

export default function useSearchAndReplace({search}) {
    // const {search} = props
    const [searchText, setSearchText] = useState(search);
    const [replace, setReplace] = useState();

    useEffect(() => {
        console.log(searchText)
        // if(searchText === 'the'){
        const searchTextOccurences = searchAndReplaceData.occurences
        setReplace(searchTextOccurences)
        // const searchTextOccurrence = 
        console.log(searchTextOccurences)
    },[searchText])

    return {
        replace,
        setReplace,
        setSearchText
    };
}