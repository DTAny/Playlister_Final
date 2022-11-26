import { useContext, useState } from 'react'
import { Box, Button, Grid, List, Menu, MenuItem, Paper, Slide, Typography } from '@mui/material';
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import GlobalStoreContext from '../store';
import PublicListCard from './PublicListCard';

export default function UserList(props) {
    const { tab, index, searchStr, setSearchStr } = props;
    const { store } = useContext(GlobalStoreContext);
    let isDisplay = tab === index;
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [sortMode, setSortMode] = useState(1);
    const [sortText, setSortText] = useState('Name (A-Z)');

    let sortedList = store.lists.filter((list)=>list.published);
    if (searchStr !== null) {
        if (searchStr !== ""){
            sortedList = sortedList.filter((list)=>list.ownerUsername.includes(searchStr));
        }
        else {
            sortedList = [];
        }
    }

    if (sortMode === 1){
        sortedList = sortedList.sort((a, b)=>{
            return a.name.localeCompare(b.name);
        });
    }
    else if (sortMode === 2){
        sortedList = sortedList.sort((a, b)=>{
            let aTime = Date.parse(a.publishedAt);
            let bTime = Date.parse(b.publishedAt);
            return bTime - aTime;
        })
    }
    else if (sortMode === 3){
        sortedList = sortedList.sort((a, b)=>{
            return b.plays - a.plays;
        })
    }
    else if (sortMode === 4){
        sortedList = sortedList.sort((a, b)=>{
            return b.likes - a.likes;
        })
    }
    else if (sortMode === 5){
        sortedList = sortedList.sort((a, b)=>{
            return b.dislikes - a.dislikes;
        })
    }
    let playlists = <Box sx={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Typography variant='h4' sx={{fontFamily: "'Segoe Script'"}}>
            {'No Playlist Found :('}
        </Typography>
    </Box>

    if (sortedList.length > 0){
        playlists = <List>
            {sortedList.map((list)=> <PublicListCard list={list} key={list.pid} />)}
        </List>
    }

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleSortByName = ()=>{
        setSortMode(1);
        setSortText('Name (A-Z)');
        handleMenuClose();
    }
    const handleSortByPublishedDate = ()=>{
        setSortMode(2);
        setSortText('Published Date (Newest)')
        handleMenuClose();
    }
    const handleSortByListens = ()=>{
        setSortMode(3);
        setSortText('Listens (High-Low)')
        handleMenuClose();
    }
    const handleSortByLikes = ()=>{
        setSortMode(4);
        setSortText('Likes (High-Low)')
        handleMenuClose(); 
    }
    const handleSortByDislikes = ()=>{
        setSortMode(5);
        setSortText('Dislikes (High-Low)')
        handleMenuClose();
    }
    const menuId = 'sort-menu'

    const SortMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            id={menuId}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleSortByName}>{'Name (A-Z)'}</MenuItem>
            <MenuItem onClick={handleSortByPublishedDate}>{'Published Date (Newest)'}</MenuItem>
            <MenuItem onClick={handleSortByListens}>{'Listens (High-Low)'}</MenuItem>
            <MenuItem onClick={handleSortByLikes}>{'Likes (High-Low)'}</MenuItem>
            <MenuItem onClick={handleSortByDislikes}>{'Dislikes (High-Low)'}</MenuItem>
        </Menu>
    ); 

    const handleClearSearch = () => {
        setSearchStr(null);
    }

    let searchHint = (
        <Typography flex={1} sx={{fontFamily: "'Segoe Script'", display: 'flex', alignItems: 'center', fontSize: '1.2em'}}>
            User Search
        </Typography>
    )
    if (searchStr !== null){
        searchHint = (
            <Box display={'flex'} alignItems='center' justifyContent='center'>
                <Typography mr='0.5em'>
                    {`Searching: "${searchStr}"`}
                </Typography>
                <Button variant='outlined' onClick={handleClearSearch}>
                    {'clear'}
                </Button>
            </Box>
        )
    }

    if (isDisplay){
        return (
            <Slide in={true} timeout={400} direction={'right'} unmountOnExit>
                <Box sx={{height: '100%'}} >
                    <Paper elevation={4} sx={{height: '100%', borderRadius: '50px', padding: '1em 2em 2em 2em'}} >
                        <Grid container>
                            <Grid item md={12} sx={{display: 'flex', flexDirection: 'row'}}>
                                {searchHint}
                                <Box flex={1} />
                                <Button size="large"
                                    edge="end"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    color="inherit"
                                    onClick={handleMenuOpen}
                                    sx={{textTransform: 'none'}}
                                >
                                    <SortRoundedIcon/>
                                    <Typography>
                                        Sort By {sortText}
                                    </Typography>
                                </Button>
                                {SortMenu}
                            </Grid>
                            <Grid item md={12} sx={{height: 'calc(100vh - 23em)', overflowY: 'scroll', borderTop: '#A6B0B26E solid 2px', p: '0.5em'}}>
                                {playlists}
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            </Slide>
        );
    }
    else return "";
}