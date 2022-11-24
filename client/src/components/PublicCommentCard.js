import ListItem from '@mui/material/ListItem';
import { Box, Card, CardContent, CardHeader, Grid, Typography} from '@mui/material';

function PublicCommentCard(props) {
    const { comment } = props;

    let cardElement =
        <ListItem
            id={'comment-' + comment.cid}
        >
            <Card sx={{width: '100%'}}>
                <CardContent sx={{p: '0.8em'}}>
                    <Box display='flex'>
                        <Typography sx={{fontSize: '1em', fontWeight: 'bolder'}}>
                            {comment.ownerUsername + ': '}
                        </Typography>
                        <Box flex={1}/>
                        <Typography sx={{fontSize: '0.8em', color: 'GrayText'}}>
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </Typography>
                    </Box>
                    <Typography sx={{fontSize: '1em', wordWrap: 'break-word'}}>
                        {comment.content}
                    </Typography>
                </CardContent>
            </Card>
        </ListItem>

    return (
        cardElement
    );
}

export default PublicCommentCard;