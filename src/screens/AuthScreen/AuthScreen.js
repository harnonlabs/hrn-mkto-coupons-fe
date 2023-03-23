import * as React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { Grid } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import BugReportIcon from '@mui/icons-material/BugReport';
import BackupIcon from '@mui/icons-material/Backup';
import PageviewIcon from '@mui/icons-material/Pageview';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadCouponsScreen from '../LoadCouponScreen/LoadCouponScreen';
import ViewCouponsScreen from '../ViewCouponsScreen/ViewCouponsScreen';
import InstallScreen from '../InstallScreen/InstallScreen';
import DeleteScreen from './../DeleteScreen/DeleteScreen';
import TestCouponsScreen from '../TestCouponsScreen/TestCouponsScreen';
import LogoutButton from '../../components/auth0/LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';

import H from './../../img/H.svg';
import UsersScreen from '../UsersScreen/UsersScreen';
import ApprovalsSCreen from '../ApprovalsScreen/ApprovalsScreen';
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function AuthScreen() {
  const theme = useTheme();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Grid container spacing={2}>
            <Grid item xs={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ mr: 2 }}>
                <img src={H} width="40" alt="Harnon.co" />
              </Box>
              <Typography variant="h6" noWrap component="div">
                Harnon Marketo Coupons
              </Typography>
            </Grid>
            <Grid item xs={7} sx={{ display: 'flex' }}></Grid>
            <Grid
              item
              xs={2}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
              }}
            >
              {isAuthenticated && <LogoutButton />}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
          '& a': {
            textDecoration: 'none',
            color: '#000',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Link to="/my-coupons">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PageviewIcon />
              </ListItemIcon>
              <ListItemText primary="My Coupons" />
            </ListItemButton>
          </ListItem>
        </Link>
        <List>
          <Link to="/load">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <BackupIcon />
                </ListItemIcon>
                <ListItemText primary="Load Coupons" />
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to="/how-to-install">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <InstallDesktopIcon />
                </ListItemIcon>
                <ListItemText primary="Install" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        <Divider sx={{ fontSize: '0.8rem' }} textAlign="right">
          ADMIN
        </Divider>
        <List>
          <Link to="/users">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SupervisedUserCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        <List>
          <Link to="/Approvals">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <VerifiedIcon />
                </ListItemIcon>
                <ListItemText primary="Approvals" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        <List>
          <Link to="/test">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <BugReportIcon />
                </ListItemIcon>
                <ListItemText primary="Test" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
        <List>
          <Link to="/delete">
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary="Delete" />
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />

        <div className="App">
          <Routes>
            <Route path="/my-coupons" element={<ViewCouponsScreen />} />
            <Route path="/load" element={<LoadCouponsScreen />} />
            <Route path="/test" element={<TestCouponsScreen />} />
            <Route path="/how-to-install" element={<InstallScreen />} />
            <Route path="/delete" element={<DeleteScreen />} />
            <Route path="/users" element={<UsersScreen />} />
            <Route path="/approvals" element={<ApprovalsSCreen />} />
          </Routes>
        </div>
      </Main>
    </Box>
  );
}
