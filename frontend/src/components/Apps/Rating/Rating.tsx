import React, { FC, Fragment, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import PageHeader from '../../../layout/Header/pageheader';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import styled from '@emotion/styled';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CircleIcon from '@mui/icons-material/Circle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import StarRateIcon from '@mui/icons-material/StarRate';
import Stack from '@mui/material/Stack';
import StarsIcon from '@mui/icons-material/Stars';
import StarIcon from '@mui/icons-material/Star';

  // Multi Star Rating

  const StyledStarRating = styled(Rating)(
    { color: '#E74C3C' }
  );
//Heart rating
const StyledRating = styled(Rating)(
	{ color: '#F1C40F' }
);

// Multi Heart Rating
const StyledheartRating = styled(Rating)(
	{ color: '#E74C3C' }
);

  const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
  };
  
  function getLabelText(value) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
  }

// const Rating: FC<RatingProps> = () => (
    
const Ratings = () => {
  
  //Execute callback when rating function
  const [data, setData] = useState<any>(3)

  let myAlert:any = (value:any) => {
    if (value != undefined) {
      alert(`Rating Stage is ${value}`)
    }
    setData(value)
  }


  const [value, setValue] = React.useState(2);
  const [hover, setHover] = React.useState(-1);

//Alert
function myfunction(){
  alert("Sample 3's Rate is 0");
}
  return(
  <Fragment>
    <PageHeader  title="Ratings" />
    <Row className="row-cards">
      <Col md={6}>
        <Card>
          <Card.Header>
            <Card.Title>
              Star Rating
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <div onClick={myfunction} className="rating-stars block" id="rating-1" data-stars="2">
            <Box sx={{ '& > legend': { mt: 2 }, }}><Rating name="no-value" size="large" value={2} max={5} /></Box>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <Card.Header>
            <Card.Title>
              Heart Rating
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="rating-stars block" id="rating-2" data-stars="2">
            <Box sx={{ '& > legend': { mt: 2 }, }}>
									<StyledRating name="customized-color" defaultValue={2} icon={<FavoriteIcon fontSize="inherit" />} emptyIcon={<FavoriteBorderIcon fontSize="inherit" />} />
								</Box>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <Card.Header>
            <Card.Title>
              Multi Star Rating
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="rating-stars block" id="rating-3" data-stars="2">
           
                <Box sx={{ '& > legend': { mt: 2 }, }}><StyledStarRating name="no-value" size="large" value={3} max={8} /></Box>
              
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <Card.Header>
            <Card.Title>
              Multi Heart Rating
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="rating-stars block" id="rating-6" data-stars="2">
            <Box sx={{ '& > legend': { mt: 2 }, }}>
									<StyledheartRating name="no-value" size="large" value={3} max={8} icon={<FavoriteIcon fontSize="inherit" />} emptyIcon={<FavoriteBorderIcon fontSize="inherit" />} />
								</Box>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <Card.Header>
            <Card.Title>
              Multi circle Rating
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="rating-stars block" id="rating-4" data-stars="2">
            <Box sx={{ '& > legend': { mt: 2 }, }}>
									<Rating name="no-value" size="large" value={4} max={8} icon={<CircleIcon fontSize="inherit" />} emptyIcon={<CircleIcon fontSize="inherit" />} />
								</Box>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <Card.Header>
            <Card.Title>
              Thumbs-up Rating
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="rating-stars block" id="rating-5" data-stars="2">
            <Box sx={{ '& > legend': { mt: 2 }, }}>
									<Rating name="no-value" size="large" value={3} max={5} icon={<ThumbUpIcon fontSize="inherit" />} emptyIcon={<ThumbUpIcon fontSize="inherit" />} />
								</Box>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row className="row-cards">
      <Col md={6}>
        <Card>
          <Card.Header>
            <Card.Title>
              Basic Star Rating
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="rating-stars block my-rating">
            <Stack spacing={1} className="rating-stars block my-rating ratingcenter">
								<Rating name="half-rating" value={1.5} precision={0.5} size="large" icon={<StarRateIcon fontSize="inherit" />} emptyIcon={<StarRateIcon fontSize="inherit" />} />
							</Stack>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <Card.Header>
            <Card.Title>
              Rounded star Rating
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="rating-stars  block my-rating-4" data-rating="2">
            <Stack spacing={1} className="rating-stars  block my-rating-4">
								<Rating name="half-rating" value={1.5} precision={0.5} size="large" icon={<StarsIcon fontSize="inherit" />} emptyIcon={<StarsIcon fontSize="inherit" />} />
							</Stack>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <Card.Header>
            <Card.Title>
              gradients Rating
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="rating-stars block my-rating-5" data-rating="5">
            <Box sx={{ '& > legend': { mt: 2 }, }}><Rating name="no-value" size="large" value={5} max={5} /></Box>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <Card.Header>
            <Card.Title>
              Execute callback when rating
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="rating-stars block my-rating-6" data-rating="2">
            <Box sx={{ '& > legend': { mt: 2 }, }}><Rating name="no-value" size="large" value={2} max={5} onChange={(ele:any) => { myAlert(ele.target.value) }} onClick={() => { myAlert() }} /></Box>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <Card.Header>
            <Card.Title>
              read only mode
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="rating-stars block my-rating-7" data-rating="2">
            <Stack spacing={1} className="rating-stars block my-rating-7">
								<Rating name="half-rating-read" value={2} max={5} size="large" readOnly />
							</Stack>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <Card.Header>
            <Card.Title>
              Use fullstars
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="rating-stars block my-rating-8" data-rating="2">
            <Box sx={{ '& > legend': { mt: 2 }, }}><Rating name="no-value" size="large" value={2} max={5} onChange={(ele:any) => { myAlert(ele.target.value) }} onClick={() => { myAlert() }} /></Box>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <Card.Header>
            <Card.Title>
              On hover event
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="rating-stars block my-rating-9" data-rating="2">
            <Box>
									<Rating name="hover-feedback" value={value} precision={1} getLabelText={getLabelText} emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
										onChange={(event, newValue:any) => {
											setValue(newValue);
										}}
										onChangeActive={(event, newHover) => {
											setHover(newHover);
										}}
									/>
								</Box>
            </div>
            <span className="live-rating"></span>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <Card.Header>
            <Card.Title>
              rating level colors
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="rating-stars block my-rating-10" data-rating="2">
            <Box sx={{ '& > legend': { mt: 2 }, }}><Rating name="no-value" size="large" value={2} max={5} onChange={(ele:any) => { myAlert(ele.target.value) }} onClick={() => { myAlert() }} /></Box>
            </div>
          </Card.Body>
          
        </Card>
      </Col>
    </Row>
  </Fragment>
)
};
export default Ratings;
