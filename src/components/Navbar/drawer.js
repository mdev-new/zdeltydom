import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';

import { NavLink as Link } from 'react-router-dom'

export default function Drawer({auth, routes}) {
	return (<div>
				<List>
				{
					routes.map(([text, val, perm]) => (
						perm ?
						<ListItem key={text} disablePadding>
							{
								val.startsWith('/') ?
								<Link style={({ isActive }) => (isActive ? {color: 'white', backgroundColor: 'red'} : {color: 'black'})} to={val}>
									<ListItemButton>
										<ListItemText primary={text} />
									</ListItemButton>
								</Link>
								: <a style={{color: 'black'}} href={val} target="_blank" rel="noopener noreferrer">
									<ListItemButton>
										<ListItemText primary={text} />
									</ListItemButton>
								</a>
							}

						</ListItem>
						: (text == 'divider' && val == 'divider') && <Divider />
					))
				}
				</List>
			</div>
	);
}