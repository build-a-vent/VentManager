import Colors from '../../constants/Colors';

export const baseStyles = {
  wrapper: {
    width: '100%',
    height: '100%',
    paddingTop: 0,
  },

  headline: {
    fontWeight: 'bold',
    fontSize: 24,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    zIndex: 1,
    backgroundColor: Colors.white,
  },
  iconHeadline: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingLeft: 10,
  },
  headlineIcon: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  menu: (width = 200, height = 200) => ({
    zIndex: 10,
    position: 'absolute',
    width,
    height,
    backgroundColor: Colors.white,
    right: 0,
    top: 40,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
  }),
  menuText: {
    lineHeight: 40,
  },
};
