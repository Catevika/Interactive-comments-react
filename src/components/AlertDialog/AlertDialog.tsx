import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import './alertDialog.css';

type Props = {
  handleDeleteComment: () => Promise<void>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const theme = createTheme({
  components: {
    MuiDialog: { styleOverrides: { paper: { maxWidth: '450px' } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: '10px' } } },
    MuiTypography: { styleOverrides: { root: { fontFamily: "'Rubik', sansSerif", fontSize: '1.3rem', color: 'var(--grayish-blue)' } } },
    MuiDialogTitle: { styleOverrides: { root: { fontWeight: '700', color: 'var(--grayish-blue)', padding: '14px 20px' } } },
    MuiDialogContent: { styleOverrides: { root: { fontSize: '1rem', padding: '14px 20px 10px 20px' } } },
    MuiButton: { styleOverrides: { root: { color: 'var(--white)' } } }
  }
});


const AlertDialog = ({ open, setOpen, handleDeleteComment }: Props) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledEngineProvider injectFirst>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" className='title'>
            {"Delete comment"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this comment ?
              This will remove the comment and can't be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} className="button-no">NO, CANCEL</Button>
            <Button onClick={handleDeleteComment} autoFocus className="button-yes">
              YES, DELETE
            </Button>
          </DialogActions>
        </Dialog>
      </StyledEngineProvider>
    </ThemeProvider>
  );
};

export default AlertDialog;