require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom'
import ImgFigture from'./ImgFigure'

let imageDatas = require('../data/imageData.json');

/*导入图片*/
imageDatas = (function genImageURL(imageDatasArr) {
  for (let i = 0; i < imageDatasArr.length; i++) {
    let singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.fileName);

    imageDatasArr[i] = singleImageData;
  }

  return imageDatasArr;
})(imageDatas);

function getRandom(low,high) {

  return Math.ceil(Math.random()*(high-low)+low)
}

class AppComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      imgsArrangeArr: [

      ],
      Constant:{
        centerPos: {
          left: 0,
          right: 0
        },
        hPosRange: {//水平方向的取值范围
          leftSecx: [0, 0],
          rightSecx: [0, 0],
          y: [0, 0]
        },
        vPosRange: {//垂直方向的取值范围
          x: [0, 0],
          topY: [0, 0]
        }
      }
    }
  }

  /*
   * 重新布局所有图片
   * */
  rearrange(centerIndex) {

    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.state.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecx = hPosRange.leftSecx,
      hPosRangeRightSecx = hPosRange.rightSecx,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),//取1个或者不取

      topImgSpliceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    //  首先居中centerIndex 的图片
    imgsArrangeCenterArr[0].pos = centerPos;
    //  取出要布局的上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //  布局位于上侧的图片
    imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index].pos = {
        top: getRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
        left: getRandom(vPosRangeX[0], vPosRangeX[1])
      }

    })

    //  布局左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosArrangeLORX = null;

      //  前半部分布局左边，右半部分布局右边
      if (i < k) {
        hPosArrangeLORX = hPosRangeLeftSecx
      } else {
        hPosArrangeLORX = hPosRangeRightSecx

      }

      imgsArrangeArr[i].pos = {
        top: getRandom(hPosRangeY[0], hPosRangeY[1]),
        left: getRandom(hPosArrangeLORX[0], hPosArrangeLORX[1]),
      }
    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    })
  }
  //组件加载以后，为每张图片计算其位置的范围
  componentDidMount() {

    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    //  拿到一个imageFigture的大小
    let imgFigtureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigtureDOM.scrollWidth,
      imgH = imgFigtureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    this.state.Constant.centerPos = {
      left: halfStageH - halfImgH,
      top: halfStageW - halfImgW,
    };
    //计算左侧、右侧图片排布位置的取值范围
    this.state.Constant.hPosRange.leftSecx[0] = -halfImgW
    this.state.Constant.hPosRange.leftSecx[1] = halfImgW - halfImgW * 3;
    this.state.Constant.hPosRange.rightSecx[0] = halfStageW + halfImgW;
    this.state.Constant.hPosRange.rightSecx[1] = stageW - halfImgW;

    this.state.Constant.hPosRange.y[0] = -halfImgW;
    this.state.Constant.hPosRange.y[1] = stageH - halfImgH;
    //计算上册图片排布位置的取值范围

    this.state.Constant.vPosRange.topY[0] = -halfImgH;
    this.state.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;//
    this.state.Constant.vPosRange.x[0] = halfStageW - imgW;//
    this.state.Constant.vPosRange.x[1] = halfStageW;//

    this.rearrange(0)
  }

  render() {
    let controllerUnits = [];
    let imageFigures = [];


    imageDatas.forEach(function (value, index) {

      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          }
        }
      }
      imageFigures.push(<ImgFigture key={index} ref={`imgFigure${index}`}
                                    data={value}
                                    arrange={this.state.imgsArrangeArr[index]}
      />);
    }.bind(this));


    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imageFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
