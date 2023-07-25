const csvUrl = 'https://raw.githubusercontent.com/ian-Liaozy/Information-Visualization-Spring-2021-Final-Project/main/Updated%20Data.csv';
const mapUrl = "https://raw.githubusercontent.com/ian-Liaozy/Information-Visualization-Spring-2021-Final-Project/main/china.json";
const mapData ='https://raw.githubusercontent.com/ian-Liaozy/Information-Visualization-Spring-2021-Final-Project/main/mapcount.csv';
const timeData = 'https://raw.githubusercontent.com/ian-Liaozy/Information-Visualization-Spring-2021-Final-Project/main/timeSeriesData.csv';

function useData(csvPath){
    const [dataAll, setData] = React.useState(null);
    React.useEffect(() => {
        d3.csv(csvPath).then(data => {
            data.forEach(d => {
                d.like = +d.like;
                // d.dateformat = new Date(d.date);
                d.date = d.date;
            });
            setData(data);
        });
    }, []);
    return dataAll;
}
function useMapData(csvPath){
    const [dataAll, setData] = React.useState(null);
    React.useEffect(() => {
        d3.csv(csvPath).then(data => {
            data.forEach(d => {
                d.latitude = +d.latitude;
                d.longitude = +d.longitude;
                d.count = +d.count;
                //derive a new attribute: popularity
            });
            //if (data)
            setData(data);
        });
    }, []);
    return dataAll;
}

function useTimeData(timePath){
    const [dataAll, setData] = React.useState(null);
    React.useEffect(() => {
        d3.csv(timePath).then(data => {
            data.forEach(d => {
                d.count = +d.count;
                d.date = d.date_ymd;
            });
            //if (data)
            setData(data);
        });
    }, []);
    return dataAll;
}

//symbol map start --------------------------------------------------------------------------------------------------------
function useMap(jsonPath) {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        d3.json(jsonPath).then(geoJsonData => {
            setData(geoJsonData);
        })
    }, []);
    return data;
}
function SymbolCaption(props) {}

function SymbolMap(props) {
    const {x, y, map, data, height, width,location,setLocation,dataAll,mouseOver,mouseOut,hovlocation,setHovlocation,click,unclick} = props;
    const projection = d3.geoMercator().fitSize([width, height], map);
    const path = d3.geoPath(projection);
    const radius = d3.scalePow().exponent(0.7).range([4, 120])
        .domain([d3.min(dataAll, d => d.count), d3.max(dataAll, d => d.count)]); 

    return <g transform={`translate(${x}, ${y})`}>
            {map.features.map((feature, idx) => {
            return <path key={idx+"boundary"} className={"boundary"} d={path(feature)}
            onClick={unclick}
            />
        })}
        {map.features.filter(d => d.properties.name === hovlocation).map((feature, idx) => {
            return<g> 
            <path key={idx+"boundary"} className={"selectedBoundary"} d={path(feature)} />
                </g>
        })}
        {map.features.filter(d => d.properties.name === location).map((feature, idx) => {
            return<g> 
            <path key={idx+"boundary"} className={"selectedBoundary"} d={path(feature)} />
                </g>
        })}

        
        {data.map(d => {
            const [x, y] =  projection([ d.latitude,d.longitude]);//not interchangable 
            return  <circle key={"location" + d.longitude+d.latitude} cx={x} cy={y+2}  r={2} opacity={0.8} 
            className={"sphereCenter"}  />
        })}
        {data.map(d => {
            const [x, y] =  projection([ d.latitude,d.longitude]);//not interchangable 
            return <circle key={"location" + d.longitude+d.latitude} cx={x} cy={y+2}  r={radius(d.count)} opacity={0.65} 
            className={"sphere"} onMouseOver={() => mouseOver(d)} onMouseOut={mouseOut} onClick={() => click(d)} />   
        })}
            {data.filter(d => d.location === hovlocation).map( d => {
            const [x, y] =  projection([ d.latitude,d.longitude]);//not interchangable 
            return <g transform={`translate(${x-30}, ${y-30})`}>
            <text id="symbolText" >{hovlocation}</text>
            <text id="symbolText" transform={`translate(${0}, ${20})`}>Comment Count:{d.count}</text>
            </g>
        })}
            {data.filter(d => d.location === location).map( d => {
            const [x, y] =  projection([ d.latitude,d.longitude]);//not interchangable 
            return <g transform={`translate(${x-30}, ${y-30})`}>
            <text id="symbolText">{location}</text>
                </g>
        })}

        {dataAll.filter(d => d.location === location).map( d => {
            const [x, y] =  projection([ d.latitude,d.longitude]);//not interchangable 
            return <g>
            <text  style={{fontSize:'16px' }} transform={`translate(${0}, ${590})`}>Click on the map to see all provinces</text>
                </g>
        })}
        </g>
}

//symbol map end --------------------------------------------------------------------------------------------------------

//bar chart start --------------------------------------------------------------------------------------------------------
function BarChart(props) {
    const {data,width, height,margin,barMode,dataSelected,location, brushExtent,maxdate} = props;
    
    const xScaleDay = d3.scaleBand()
                .range ([0, width])
                .padding(0.05)
                .domain(data.map(function(d) { return d.day; }));
            
    const yScaleDay = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(data, d => d.count)])
                .nice(); 
    
    return <g transform={`translate(${margin.left}, ${margin.top*2})`}>
        <Bars maxdate={maxdate} location={location} data={data} xScale={xScaleDay} yScale={yScaleDay} width={width} height={height}barMode={barMode} dataSelected={dataSelected}/>
        <YAxis yScale={yScaleDay} height={height} barMode={barMode}/>
        <XAxis data={data} xScale={xScaleDay} width={width} height={height} barMode={barMode}/>
        </g>
    } 
function YAxis(props) {
    const {yScale, height,barMode} = props;
    var ticks;
    var size;
    if(barMode==2) {ticks = yScale.ticks(9);size='10px';}
    else if(barMode==1) {ticks = yScale.ticks(5);size='10px';}
    return <g>
        <line y2={height} stroke={`black`}  strokeWidth={"2px"}/>
        {ticks.map( tickValue => {
            return <g key={tickValue} transform={`translate(-10, ${yScale(tickValue)})`}>
                    <line x2={10} stroke={"black"} />
                    <text style={{ textAnchor:'end', fontSize:size }}>
                    {tickValue}
                    </text>
                </g> 
        })}
    </g>    
    }
function XAxis(props) {
    const {xScale, width, height,data,barMode} = props;     
    const xAxis = d3.axisBottom(xScale).tickValues(xScale.domain());
            //const ticks = xScale.ticks();
    var size;
    var xgap;
    if(barMode==2) {size='9px';xgap=3;}
    else if(barMode==1) {size='10px';xgap=-7;}
    return <g>
            <line x1={0} y1={height} x2={width} y2={height} stroke={`black`} strokeWidth={"2px"}/>
            {data.map(d => {
                return <g key={d.day} transform={`translate(${xScale(d.day)+5-xgap}, ${height-5})`}>
                        <text style={{ textAnchor:'start', fontSize:size}} y={20}>
                        {d.day.slice(0, 3)}
                        </text>
                </g> 
                })}
            </g>     
}

function Bars(props) {
    const {data, xScale, yScale, width, height,barMode,dataSelected,location,brushExtent,maxdate} = props;
    if(data[0].count==dataSelected[0].count){
        return <g>
            {data.map(d => {
                return <rect key={d.day} x={xScale(d.day)} 
                y={yScale(d.count)} 
                width={xScale.bandwidth()}
                height={height-yScale(d.count)}
                className={"bar"} stroke={"black"}  
                />
            })} </g>
    }
    else{return <g>
            {data.map(d => {
                return <rect key={d.day} x={xScale(d.day)} 
                y={yScale(d.count)} 
                width={xScale.bandwidth()}
                height={height-yScale(d.count)}
                className={"bar"} stroke={"black"}  
                />
            })}
            {dataSelected.map(d => {
                return <rect key={d.day} x={xScale(d.day)} 
                y={yScale(d.count)} 
                width={xScale.bandwidth()}
                height={height-yScale(d.count)}
                className={"barSelected"} stroke={"black"}  
                />
            })}
        </g>
    } 
}

//bar chart end --------------------------------------------------------------------------------------------------------

function TreeMapText(props) {
    const { d } = props;
    return <foreignObject width={d.x1-d.x0} height={d.y1-d.y0}>
        <div >
            <p>{d.ancestors().reverse().slice(1).map((d, idx) => d.data.name)
                .join("\n")}</p>
        </div>
        </foreignObject>
}

function TreeMap(props) {
    const { width, height, root, selectedNode, setSelectedNode, setTooltipX, setTooltipY,brushExtent} = props;
    if (root.height != 0){
    const margin = { top: 20, right: 40, bottom: 20, left: 40, gap: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.gap;

    const tree = d3.treemap().tile(d3.treemapBinary).size([innerWidth, innerHeight]).padding(2)
        .round(true)(root).sort((a, b) => b.value - a.value);;
    
    const parents = tree.leaves().map( d => d.parent.data.name);
    const parentsCategories = parents.filter( (d, idx) => parents.indexOf(d) === idx );
    const color = d3.scaleOrdinal(d3.schemeBuPu[4]).domain(parentsCategories);
    const firstLayer = tree.descendants()[0].children;
    
    return <svg width={width} height={height}>
    <g transform={`translate(${margin.left}, ${margin.right})`}>
        {tree.leaves().map( (d, idx) => {
            return <g key={idx+"treemap"} transform={`translate(${d.x0}, ${d.y0})`}
                    onMouseOver={(event)=> {
                        setSelectedNode(d);
                        setTooltipX(event.pageX);
                        setTooltipY(event.pageY+40);
                    }} 
                    onMouseOut={()=> {
                        setSelectedNode(null);
                        setTooltipX(null);
                        setTooltipY(null);
                    }}>
                <rect width={d.x1-d.x0} height={d.y1-d.y0} stroke={"none"} 
                    fill={selectedNode && d.data.group[0].comment_text === selectedNode.data.group[0].comment_text ? "#FFD646" : color(d.parent.data.name)} 
                    opacity={0.8}/>
                <TreeMapText d={d} />
            </g>
        })}
        
        {firstLayer.map( (d, idx) => {
            return <g key={idx+"outerline"} transform={`translate(${d.x0}, ${d.y0})`}>
                <rect width={d.x1-d.x0} height={d.y1-d.y0} stroke={"black"} fill={"none"}/>
                <text style={{fontSize:"4.5em"}} x={ (d.x1-d.x0)/2 } y={ (d.y1-d.y0)/2 } textAnchor={"middle"} opacity={0.3} 
                transform={`rotate(${(d.x1-d.x0)>(d.y1-d.y0)? 0: 90}, ${(d.x1-d.x0)/2}, ${(d.y1-d.y0)/2})`}>
                    {d.data.name}
                    </text>
                </g>
        })}
        </g>
    </svg>
    }
    else {return<g  transform={"translate(100, 100)"}>
    <pre style={{fontSize:'16px' }}>
                <b> </b>
                    <b> </b>
            </pre></g>}
}

function TreeTooltip(props) {
    const {d, left, top} = props;
    if (left === null) {
        return <div></div>;
    } else {
        const divStyle = {
            position: "absolute",
            textAlign: "left",
            width: "160px",
            height: "80px",
            background: "#DAF7A6",
            padding: "5px",
            fontSize: "15px",
            borderRadius: "8px",
            pointerEvents: "none",
            left: `${left-910}px`,
            top: `${top-1000}px`
        };
    return <div className="treeTooltip" style={divStyle} >
        <p>{d.ancestors().reverse().slice(1).map((d, idx) => d.data.name)
            .join("\n")}</p>
        <p>{"Count: " + d.value}</p>
        </div>
    };  
}

function buildTree(data, attributes,brushExtent) {
    //data: a list of objects, loaded from backend
    //attributes: the attributes that define the hierarchy 
    const filteredData = brushExtent?data.slice(brushExtent[0], brushExtent[1]):data;

    let itemArr = [];
    if (attributes.length === 0){
        return null;
    }
    let groups = d3.groups( data, d => d[attributes[0]]);
    let levels = groups.map( d => d[0]);
    for (let i = 0; i < levels.length; i++) {
        let count = groups[i][1].length;
        itemArr.push({name: levels[i], children: buildTree(groups[i][1], attributes.slice(1)),
                value: count, group: groups[i][1]});
    } 
    return itemArr;
}
// tree map ends --------------------------------------------------------------------------------------------------------

// Time Series starts ---------------------------------------------------------------------------------------------------
function TimeSeriesChart(props) {
    const {data, offsetX, offsetY, width, height, setBrushExtent,brushExtent,setMinDate,setMaxDate,mindate, maxdate,unclickTime} = props;
    // const xValue = d => d.date;
    // const yValue = d => +d.count;
    if (data) {
    const brushRef = React.useRef();
    var start;
    var end;
    React.useEffect( () => {
        const brush = d3.brushX().extent([[0, 0], [width, height]]);
        brush(d3.select(brushRef.current));
        brush.on('brush end', (event) => {
            const eachBand = xScale.step();
            const index = event.selection && event.selection.map(d => Math.round(d/eachBand));
            setBrushExtent(event.selection && index);
            start = new Date(data[index[0]].date);
            end = new Date(data[index[1]].date);
            //console.log(data[index[0]].date);
            setMinDate(data[index[0]].date);
            setMaxDate(data[index[1]].date);
            
        }
        , [width, height]);
    });

    const xScale = d3.scaleBand()
    .range([0,width])
    .padding(0.05)
    .domain(data.map(d=>d.date));

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([height, 0])
        .nice();

    const p1 = d3.area()
            .x(d => xScale(d.date))
            .y0(height)
            .y1(d => yScale(d.count))
            .curve(d3.curveBasis)
            (data);

    const ticks1 = yScale.ticks(10).map(tickValue => (
        <g className='tick'
        key={tickValue}
        transform={`translate(-10, ${yScale(tickValue)})`}
        >
        <line x2={10} stroke='black' />
            <text style={{ textAnchor: 'end', fontSize:'10px' }}>
                { tickValue }
            </text>
        </g>));

    return <g transform={`translate(${offsetX}, ${offsetY})`} onClick={unclickTime} >
        <path d={p1} fill={'lightblue'} stroke={'black'}  />
        <line y1={0} y2={height} stroke={'black'}/>
        {ticks1}
        <text> From {mindate} to {maxdate} </text>
        <g ref={brushRef} />
        
        </g>
    }
}  
//wordcloud start--------------------------------------------------------------------------------------------------------
    function DrawWordCloud(props){

    const {x, y, width, height, word_entries} = props;
    
    const d3Selection = React.useRef();
    React.useLayoutEffect( (event)=>{         
    var fill = d3.scaleOrdinal(d3.schemeTableau10 ); 
    var w = width;
    var h = height;
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(word_entries, d => d.size)])
        .range([10,200]);  
    d3.layout.cloud()
        .size([width, height])
        .words(word_entries)
        .padding(2)
        .rotate(function () {
            return 0;
        })
        .fontSize(function (d) {
            return xScale(d.size);
        })
        .on("end", draw)
        .start();

    function draw(words) {
    d3.select("g")
        .select("svg")
        .remove()
    d3.select("g")
        .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) {
                return d.size + "px";
            })
            .style("font-family", "Microsoft JhengHei")
            .style("cursor", 'pointer')
            .style("fill", function (d, i) {
                return fill(i);
            })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) {
                return d.text;
            })
        }
    }, [width, height,word_entries]);
    d3.layout.cloud().stop();
    
    return <div  width={500} height={500} ref={d3Selection} >
    <g transform={`translate(${1060}, ${200})`}/>
            </div>
    }

const Graph = () => {
    const [location, setLocation] = React.useState(null);
    const [hovlocation, setHovlocation] = React.useState(null);
    const [barMode, setbarMode] = React.useState(2);//1:day;2:hour
    const [selectedNode, setSelectedNode] = React.useState(null); // TreeMap
    const [tooltipX, setTooltipX] = React.useState(null); // TreeMap
    const [tooltipY, setTooltipY] = React.useState(null); // TreeMap
    const [brushExtent, setBrushExtent] = React.useState(null); // Line Chart
    const [mindate, setMinDate] = React.useState("2016/11/12"); // Line Chart 
    const [maxdate, setMaxDate] = React.useState("2020/6/13"); // Line Chart 
    const dataAll = useData(csvUrl);
    const map = useMap(mapUrl);
    const countData = useTimeData(timeData);
    var locationList=useMapData(mapData);
    var locationAll=useMapData(mapData);

    var text_string;
    var common = "说,啊,阿,哎,哎呀,哎哟,唉,俺,俺们,按,按照,吧,吧哒,把,罢了,被,本,本着,比,比方,比如,鄙人,彼,彼此,边,别,别的,别说,并,并且,不比,不成,不单,不但,不独,不管,不光,不过,不仅,不拘,不论,不怕,不然,不如,不特,不惟,不问,不只,朝,朝着,趁,趁着,乘,冲,除,除此之外,除非,除了,此,此间,此外,从,从而,打,待,但,但是,当,当着,到,得,的,的话,等,等等,地,第,叮咚,对,对于,多,多少,而,而况,而且,而是,而外,而言,而已,尔后,反过来,反过来说,反之,非但,非徒,否则,嘎,嘎登,该,赶,个,各,各个,各位,各种,各自,给,根据,跟,故,故此,固然,关于,管,归,果然,果真,过,哈,哈哈,呵,和,何,何处,何况,何时,嘿,哼,哼唷,呼哧,乎,哗,还是,还有,换句话说,换言之,或,或是,或者,极了,及,及其,及至,即,即便,即或,即令,即若,即使,几,几时,己,既,既然,既是,继而,加之,假如,假若,假使,鉴于,将,较,较之,叫,接着,结果,借,紧接着,进而,尽,尽管,经,经过,就,就是,就是说,据,具体地说,具体说来,开始,开外,靠,咳,可,可见,可是,可以,况且,啦,来,来着,离,例如,哩,连,连同,两者,了,临,另,另外,另一方面,论,嘛,吗,慢说,漫说,冒,么,每,每当,们,莫若,某,某个,某些,拿,哪,哪边,哪儿,哪个,哪里,哪年,哪怕,哪天,哪些,哪样,那,那边,那儿,那个,那会儿,那里,那么,那么些,那么样,那时,那些,那样,乃,乃至,呢,能,你,你们,您,宁,宁可,宁肯,宁愿,哦,呕,啪达,旁人,呸,凭,凭借,其,其次,其二,其他,其它,其一,其余,其中,起,起见,岂但,恰恰相反,前后,前者,且,然而,然后,然则,让,人家,任,任何,任凭,如,如此,如果,如何,如其,如若,如上所述,若,若非,若是,啥,上下,尚且,设若,设使,甚而,甚么,甚至,省得,时候,什么,什么样,使得,是,是的,首先,谁,谁知,顺,顺着,似的,虽,虽然,虽说,虽则,随,随着,所,所以,他,他们,他人,它,它们,她,她们,倘,倘或,倘然,倘若,倘使,腾,替,通过,同,同时,哇,万一,往,望,为,为何,为了,为什么,为着,喂,嗡嗡,我,我们,呜,呜呼,乌乎,无论,无宁,毋宁,嘻,吓,相对而言,像,向,向着,嘘,呀,焉,沿,沿着,要,要不,要不然,要不是,要么,要是,也,也罢,也好,一,一般,一旦,一方面,一来,一切,一样,一则,依,依照,矣,以,以便,以及,以免,以至,以至于,以致,抑或,因,因此,因而,因为,哟,用,由,由此可见,由于,有,有的,有关,有些,又,于,于是,于是乎,与,与此同时,与否,与其,越是,云云,哉,再说,再者,在,在下,咱,咱们,则,怎,怎么,怎么办,怎么样,怎样,咋,照,照着,者,这,这边,这儿,这个,这会儿,这就是说,这里,这么,这么点儿,这么些,这么样,这时,这些,这样,正如,吱,之,之类,之所以,之一,只是,只限,只要,只有,至,至于,诸位,着,着呢,自,自从,自个儿,自各儿,自己,自家,自身,综上所述,总的来看,总的来说,总的说来,总而言之,总之,纵,纵令,纵然,纵使,遵照,作为,兮,呃,呗,咚,咦,喏,啐,喔唷,嗬,嗯,嗳,啊哈,啊呀,啊哟,挨次,挨个,挨家挨户,挨门挨户,挨门逐户,挨着,按理,按期,按时,按说,暗地里,暗中,暗自,昂然,八成,白白,半,梆,保管,保险,饱,背地里,背靠背,倍感,倍加,本人,本身,甭,比起,比如说,比照,毕竟,必,必定,必将,必须,便,别人,并非,并肩,并没,并没有,并排,并无,勃然,不,不必,不常,不大,不得,不得不,不得了,不得已,不迭,不定,不对,不妨,不管怎样,不会,不仅仅,不仅仅是,不经意,不可开交,不可抗拒,不力,不了,不料,不满,不免,不能不,不起,不巧,不然的话,不日,不少,不胜,不时,不是,不同,不能,不要,不外,不外乎,不下,不限,不消,不已,不亦乐乎,不由得,不再,不择手段,不怎么,不曾,不知不觉,不止,不止一次,不至于,才,才能,策略地,差不多,差一点,常,常常,常言道,常言说,常言说得好,长此下去,长话短说,长期以来,长线,敞开儿,彻夜,陈年,趁便,趁机,趁热,趁势,趁早,成年,成年累月,成心,乘机,乘胜,乘势,乘隙,乘虚,诚然,迟早,充分,充其极,充其量,抽冷子,臭,初,出,出来,出去,除此,除此而外,除此以外,除开,除去,除却,除外,处处,川流不息,传,传说,传闻,串行,纯,纯粹,此后,此中,次第,匆匆,从不,从此,从此以后,从古到今,从古至今,从今以后,从宽,从来,从轻,从速,从头,从未,从无到有,从小,从新,从严,从优,从早到晚,从中,从重,凑巧,粗,存心,达旦,打从,打开天窗说亮话,大,大不了,大大,大抵,大都,大多,大凡,大概,大家,大举,大略,大面儿上,大事,大体,大体上,大约,大张旗鼓,大致,呆呆地,带,殆,待到,单,单纯,单单,但愿,弹指之间,当场,当儿,当即,当口儿,当然,当庭,当头,当下,当真,当中,倒不如,倒不如说,倒是,到处,到底,到了儿,到目前为止,到头,到头来,得起,得天独厚,的确,等到,叮当,顶多,定,动不动,动辄,陡然,都,独,独自,断然,顿时,多次,多多,多多少少,多多益善,多亏,多年来,多年前,而后,而论,而又,尔等,二话不说,二话没说,反倒,反倒是,反而,反手,反之亦然,反之则,方,方才,方能,放量,非常,非得,分期,分期分批,分头,奋勇,愤然,风雨无阻,逢,弗,甫,嘎嘎,该当,概,赶快,赶早不赶晚,敢,敢情,敢于,刚,刚才,刚好,刚巧,高低,格外,隔日,隔夜,个人,各式,更,更加,更进一步,更为,公然,共,共总,够瞧的,姑且,古来,故而,故意,固,怪,怪不得,惯常,光,光是,归根到底,归根结底,过于,毫不,毫无,毫无保留地,毫无例外,好在,何必,何尝,何妨,何苦,何乐而不为,何须,何止,很,很多,很少,轰然,后来,呼啦,忽地,忽然,互,互相,哗啦,话说,还,恍然,会,豁然,活,伙同,或多或少,或许,基本,基本上,基于,极,极大,极度,极端,极力,极其,极为,急匆匆,即将,即刻,即是说,几度,几番,几乎,几经,既…又,继之,加上,加以,间或,简而言之,简言之,简直,见,将才,将近,将要,交口,较比,较为,接连不断,接下来,皆可,截然,截至,藉以,借此,借以,届时,仅,仅仅,谨,进来,进去,近,近几年来,近来,近年来,尽管如此,尽可能,尽快,尽量,尽然,尽如人意,尽心竭力,尽心尽力,尽早,精光,经常,竟,竟然,究竟,就此,就地,就算,居然,局外,举凡,据称,据此,据实,据说,据我所知,据悉,具体来说,决不,决非,绝,绝不,绝顶,绝对,绝非,均,喀,看,看来,看起来,看上去,看样子,可好,可能,恐怕,快,快要,来不及,来得及,来讲,来看,拦腰,牢牢,老,老大,老老实实,老是,累次,累年,理当,理该,理应,历,立,立地,立刻,立马,立时,联袂,连连,连日,连日来,连声,连袂,临到,另方面,另行,另一个,路经,屡,屡次,屡次三番,屡屡,缕缕,率尔,率然,略,略加,略微,略为,论说,马上,蛮,满,没,没有,每逢,每每,每时每刻,猛然,猛然间,莫,莫不,莫非,莫如,默默地,默然,呐,那末,奈,难道,难得,难怪,难说,内,年复一年,凝神,偶而,偶尔,怕,砰,碰巧,譬如,偏偏,乒,平素,颇,迫于,扑通,其后,其实,奇,齐,起初,起来,起首,起头,起先,岂,岂非,岂止,迄,恰逢,恰好,恰恰,恰巧,恰如,恰似,千,万,千万,千万千万,切,切不可,切莫,切切,切勿,窃,亲口,亲身,亲手,亲眼,亲自,顷,顷刻,顷刻间,顷刻之间,请勿,穷年累月,取道,去,权时,全都,全力,全年,全然,全身心,然,人人,仍,仍旧,仍然,日复一日,日见,日渐,日益,日臻,如常,如此等等,如次,如今,如期,如前所述,如上,如下,汝,三番两次,三番五次,三天两头,瑟瑟,沙沙,上,上来,上去,一.,一一,一下,一个,一些,一何,一则通过,一天,一定,一时,一次,一片,一番,一直,一致,一起,一转眼,一边,一面,上升,上述,上面,下,下列,下去,下来,下面,不一,不久,不变,不可,不够,不尽,不尽然,不敢,不断,不若,不足,与其说,专门,且不说,且说,严格,严重,个别,中小,中间,丰富,为主,为什麽,为止,为此,主张,主要,举行,乃至于,之前,之后,之後,也就是说,也是,了解,争取,二来,云尔,些,亦,产生,人,人们,什麽,今,今后,今天,今年,今後,介于,从事,他是,他的,代替,以上,以下,以为,以前,以后,以外,以後,以故,以期,以来,任务,企图,伟大,似乎,但凡,何以,余外,你是,你的,使,使用,依据,依靠,便于,促进,保持,做到,傥然,儿,允许,元／吨,先不先,先后,先後,先生,全体,全部,全面,共同,具体,具有,兼之,再,再其次,再则,再有,再次,再者说,决定,准备,凡,凡是,出于,出现,分别,则甚,别处,别是,别管,前此,前进,前面,加入,加强,十分,即如,却,却不,原来,又及,及时,双方,反应,反映,取得,受到,变成,另悉,只,只当,只怕,只消,叫做,召开,各人,各地,各级,合理,同一,同样,后,后者,后面,向使,周围,呵呵,咧,唯有,啷当,喽,嗡,嘿嘿,因了,因着,在于,坚决,坚持,处在,处理,复杂,多么,多数,大力,大多数,大批,大量,失去,她是,她的,好,好的,好象,如同,如是,始而,存在,孰料,孰知,它们的,它是,它的,安全,完全,完成,实现,实际,宣布,容易,密切,对应,对待,对方,对比,小,少数,尔,尔尔,尤其,就是了,就要,属于,左右,巨大,巩固,已,已矣,已经,巴,巴巴,帮助,并不,并不是,广大,广泛,应当,应用,应该,庶乎,庶几,开展,引起,强烈,强调,归齐,当前,当地,当时,形成,彻底,彼时,往往,後来,後面,得了,得出,得到,心里,必然,必要,怎奈,怎麽,总是,总结,您们,您是,惟其,意思,愿意,成为,我是,我的,或则,或曰,战斗,所在,所幸,所有,所谓,扩大,掌握,接著,数/,整个,方便,方面,无,无法,既往,明显,明确,是不是,是以,是否,显然,显著,普通,普遍,曾,曾经,替代,最,最后,最大,最好,最後,最近,最高,有利,有力,有及,有所,有效,有时,有点,有的是,有着,有著,末##末,本地,来自,来说,构成,某某,根本,欢迎,欤,正值,正在,正巧,正常,正是,此地,此处,此时,此次,每个,每天,每年,比及,比较,没奈何,注意,深入,清楚,满足,然後,特别是,特殊,特点,犹且,犹自,现代,现在,甚且,甚或,甚至于,用来,由是,由此,目前,直到,直接,相似,相信,相反,相同,相对,相应,相当,相等,看出,看到,看看,看见,真是,真正,眨眼,矣乎,矣哉,知道,确定,种,积极,移动,突出,突然,立即,竟而,第二,类如,练习,组成,结合,继后,继续,维持,考虑,联系,能否,能够,自后,自打,至今,至若,致,般的,良好,若夫,若果,范围,莫不然,获得,行为,行动,表明,表示,要求,规定,觉得,譬喻,认为,认真,认识,许多,设或,诚如,说明,说来,说说,诸,诸如,谁人,谁料,贼死,赖以,距,转动,转变,转贴,达到,迅速,过去,过来,运用,还要,这一来,这次,这点,这种,这般,这麽,进入,进步,进行,适应,适当,适用,逐步,逐渐,通常,造成,遇到,遭到,遵循,避免,那般,那麽,部分,采取,里面,重大,重新,重要,针对,问题,防止,附近,限制,随后,随时,随著,难道说,集中,需要,非特,非独,高兴,若果,真的,处于,东西,这是,不到,一种,两个,仿佛,一条,告诉,看着,地方,好像,感到,发生,肯定,渐渐,离开,几个,地说,大部分,拥有,刚刚,样子,唯一,三个,两人,包括,熟悉,情况,转向,简单,面对,也许,一张,像是,之间,摇摇头,身上,那种,找到,明白,确实,一句,显示,终于,一眼,几个,只能,面前,见到";
    var word_count;
    var words;
    var word_entriesd;
    var word_entries;
    
    if (!map || !dataAll||!locationList||!locationAll) {
            return <pre>Loading...</pre>;
        };
        
    var data = dataAll;

    if(brushExtent!=null && mindate!=null && maxdate!=null){
        var min = mindate;
        var max = maxdate;
        data = data.filter( d=> {
            return (d.date <= max && d.date >= min);
        });
    }

    if(location==null && brushExtent == null){
        data = dataAll;
    }
    else if(location == null && brushExtent != null){
        data = data;
    }
    if((location!=null)) {
        for (var i = 0; i < locationAll.length; i++){
        locationList[i].count=0;
        locationAll[i].count=0;
        }
        data = data.filter( d=> {
            return d.location == location;
        }); 
        locationList= locationList.filter( d=> {
        return d.location == location; }); 
//------------------------------------------------------
        text_string = "";
        word_count={};

        for (var i = 0; i < data.length; i++){
            text_string += data[i].after;
        }
        words = text_string.split(/[ '\-\(\)\*":;\[\]|{},.!?]+/);

        if (words.length == 1){
            word_count[words[0]] = 1;
        } else {
            words.forEach(word => {
                if (word != "" && common.indexOf(word)==-1 && word.length>1){
                if (word_count[word]){
                    word_count[word]++;
                } else {
                    word_count[word] = 1;
                }
                }
            });
        }    
        word_entriesd = Object.entries(word_count);
        word_entriesd[0].size=word_entriesd[0][0]
        word_entriesd[0].size=word_entriesd[0][0]
        
        word_entriesd.sort(function(a, b) {
                    return b[1] - a[1];
                });
        
        word_entriesd=word_entriesd.slice(0,100);
        
        word_entries=[];
        word_entriesd.forEach(d => {return word_entries.push({text:d[0], size:d[1]})});
        
    }

    //symbol map constants start --------------------------------------------------------------------------------------------------------
    const MAPWIDTH = 2000*0.8;
    const MAPHEIGHT = 1200*0.8;
    const mapmargin = { top: 20*0.8, right: 40*0.8, bottom: 160*0.8, left: 40*0.8, gap:40*0.8};
    const mapinnerWidth = MAPWIDTH - mapmargin.left - mapmargin.right - mapmargin.gap;
    const mapinnerHeight = MAPHEIGHT - mapmargin.top - mapmargin.bottom - mapmargin.gap; 
    if((hovlocation==null&&location==null)) {
        for (var i = 0; i < locationAll.length; i++){
        locationList[i].count=0;
        locationAll[i].count=0;
        } }
    else if (location==null) {
        for (var i = 0; i < locationAll.length; i++){
        locationList[i].count=0;
        locationAll[i].count=0; 
        } }
            
    for (var i = 0; i < dataAll.length; i++){
        var comment=dataAll[i]
        for (var j=0;j<locationAll.length;j++){
            if(comment.location==locationAll[j].location){
                locationAll[j].count+=1;
                break;
            }
        }
    }  

    for (var i = 0; i < data.length; i++){
        var comment=data[i]
        for (var j=0;j<locationList.length;j++){
            if(comment.location==locationList[j].location){
                locationList[j].count+=1;
                break;
            }
        }
    }  
    
    locationList.sort(function(a, b) {
        return b.count - a.count;
    });
    
    locationAll.sort(function(a, b) {
        return b.count - a.count;
    });

    const mouseOver = d => {
        setHovlocation(d.location);
    };
    const mouseOut = () => {
        setHovlocation(null);
    };
    const click= d => {
        setLocation(d.location);
    };
    const unclick = () => {
        setLocation(null);
    };
    const unclickTime = () => {
        setMinDate("2016/11/12");
        setMaxDate("2020/6/13");
    };
    //symbol map constants end --------------------------------------------------------------------------------------------------------
    
    //wordcloud part 2 start --------------------------------------------------------------------------------------------------------
    text_string = "";
    for (var i = 0; i < data.length; i++){
        text_string += data[i].after;
    }
    word_count={};

    words = text_string.split(/[ '\-\(\)\*":;\[\]|{},.!?]+/);

    if (words.length == 1){
        word_count[words[0]] = 1;
    } else {
        words.forEach(word => {
            if (word != "" && common.indexOf(word)==-1 && word.length>1){
            if (word_count[word]){
                word_count[word]++;
            } else {
                word_count[word] = 1;
            }
            }
        });
    }    
    word_entriesd = Object.entries(word_count);
    word_entriesd[0].size=word_entriesd[0][0]
    word_entriesd[0].size=word_entriesd[0][0]
    
    word_entriesd.sort(function(a, b) {
                return b[1] - a[1];
            });
    word_entriesd=word_entriesd.slice(0,400);

    word_entries=[];
    word_entriesd.forEach(d => {return word_entries.push({text:d[0], size:d[1]})});
    //bar chart constants start --------------------------------------------------------------------------------------------------------
    var dayList=[{day:"Monday",count:0,},{day:"Tuesday",count:0,},{day:"Wednesday",count:0,},{day:"Thursday",count:0,},
    {day:"Friday",count:0,},{day:"Saturday",count:0,},{day:"Sunday",count:0,}]
    var hourList=[{day:"0",count:0,},{day:"1",count:0,},{day:"2",count:0,},{day:"3",count:0,},
    {day:"4",count:0,},{day:"5",count:0,},{day:"6",count:0,},{day:"7",count:0,},{day:"8",count:0,},{day:"9",count:0,},
    {day:"10",count:0,},{day:"11",count:0,},{day:"12",count:0,},{day:"13",count:0,},{day:"14",count:0,},
    {day:"15",count:0,},{day:"16",count:0,},{day:"17",count:0,},{day:"18",count:0,},{day:"19",count:0,},
    {day:"20",count:0,},{day:"21",count:0,},{day:"22",count:0,},{day:"23",count:0,}]
    for ( i = 0; i < dataAll.length; i++){
        comment=dataAll[i]
        for ( j=0;j<dayList.length;j++){
            if(comment.day==dayList[j].day){
                dayList[j].count+=1;
                break;}
        }
        for ( j=0;j<hourList.length;j++){
            if(comment.time==hourList[j].day){
                hourList[j].count+=1;
                break;
            }
        }
    }
        var dayListSelect=[{day:"Monday",count:0,},{day:"Tuesday",count:0,},{day:"Wednesday",count:0,},{day:"Thursday",count:0,},
    {day:"Friday",count:0,},{day:"Saturday",count:0,},{day:"Sunday",count:0,}]
    var hourListSelect=[{day:"0",count:0,},{day:"1",count:0,},{day:"2",count:0,},{day:"3",count:0,},
    {day:"4",count:0,},{day:"5",count:0,},{day:"6",count:0,},{day:"7",count:0,},{day:"8",count:0,},{day:"9",count:0,},
    {day:"10",count:0,},{day:"11",count:0,},{day:"12",count:0,},{day:"13",count:0,},{day:"14",count:0,},
    {day:"15",count:0,},{day:"16",count:0,},{day:"17",count:0,},{day:"18",count:0,},{day:"19",count:0,},
    {day:"20",count:0,},{day:"21",count:0,},{day:"22",count:0,},{day:"23",count:0,}]
    for ( i = 0; i < data.length; i++){
        comment=data[i]
        for ( j=0;j<dayListSelect.length;j++){
            if(comment.day==dayListSelect[j].day){
                dayListSelect[j].count+=1;
                break;}
        }
        for ( j=0;j<hourListSelect.length;j++){
            if(comment.time==hourListSelect[j].day){
                hourListSelect[j].count+=1;
                break;
            }
        }
    }
    const barWidth=500*0.8;
    const barHeight=400*0.8;
    const barmargin = { top: 20*0.8, right: 40*0.8, bottom: 160*0.8, left: 40*0.8, gap:40*0.8 };
    const barinnerWidth = barWidth - barmargin.left - barmargin.right - barmargin.gap;
    const barinnerHeight = barHeight - barmargin.top - barmargin.bottom - barmargin.gap;
    var barData=hourList;
    var barDataSelect=hourListSelect;
    if (barMode==1){
        barData=dayList;
        barDataSelect=dayListSelect;
    }
    else if (barMode==2){
        barData=hourList; 
        barDataSelect=hourListSelect;       
    }
    const changeHandler = (event) => {
        setbarMode(event.target.value);
    }
    
    //bar chart constants end --------------------------------------------------------------------------------------------------------
    
    //tree map constants --------------------------------------------------------------------------------------------------------
    const treeWidth=640*0.9;
    const treeHeight=600*0.9;

    let attributes = ["gender", "category", "target"];
    let root = {name: "Comments", children: buildTree(data, attributes),
    value: data};
    root = d3.hierarchy(root)
        .sum(d => {
            return d.children ? 0 : d.value;
        });
    
    //Time series chart constants --------------------------------------------------------------------------------------------------------
    const tsWidth=900*0.9;
    const tsHeight=350*0.9;;
    const tsmargin = { top: 20*0.8, right: 40*0.8, bottom: 160*0.8, left: 40*0.8, gap:0 };
    const tsinnerWidth = tsWidth - tsmargin.left - tsmargin.right - tsmargin.gap;
    const tsinnerHeight = tsHeight - tsmargin.top - tsmargin.bottom - tsmargin.gap;

    


    //Tableconstants --------------------------------------------------------------------------------------------------------
    data.sort(function(a, b) {
        return b.like - a.like;
    });
    const TABLEWIDTH = 1200*0.8;
    const TABLEHEIGHT = 600*0.8;
    const tablemargin = { top: 20*0.8, right: 40*0.8, bottom: 60*0.8, left: 40*0.8, gap:40*0.8 };
    const tableinnerWidth = TABLEWIDTH - tablemargin.left - tablemargin.right - tablemargin.gap;
    const tableinnerHeight = TABLEHEIGHT - tablemargin.top - tablemargin.bottom - tablemargin.gap; 
    
    var row = "";
    for (var i = 0; i < data.length; i++){
    row += `<tr>
                <td>${data[i].comment_text}</td>
                <td>${data[i].gender}</td>
                <td>${data[i].location}</td>
                <td>${data[i].like}</td>
                <td>${data[i].date}</td>
                <td>${data[i].target}</td>
                <td>${data[i].category}</td>
                </tr>`
    }

    return <div>
            <div class="wordmap">
            <DrawWordCloud x={1100} y={300} width={500} height={380} word_entries={word_entries}/>
        </div>
            <div style={{position: "absolute", textAlign: "left", width: "600px",left:"40px", top:"20px"}}>
            <h1 className="title" style={{color: "purple"}}>In The Mood Of Hate </h1>
            <h2> - Weibo Sexist hate Speech Analysis</h2>
            <h3>Comment Count: {data.length}</h3>
        </div>
        <svg width={1100*0.8+10} height={890*0.8}>
            <g>
                <SymbolMap x={mapmargin.left} y={mapmargin.top} height={mapinnerHeight+mapmargin.gap} mouseOver={mouseOver} mouseOut={mouseOver}
                width={mapinnerWidth/2} data={locationList} map={map}location={location}setLocation={setLocation} dataAll={locationAll}
                hovlocation={hovlocation} setHovlocation={hovlocation} click={click} unclick={unclick}/>
            </g>   
        </svg>
        <div class="barChart"> <div> <select onChange={changeHandler}>
        <option value ={2}>Hours In a Day</option>
        <option value ={1}>Days In a Week</option>
        </select></div>
        <svg transform={`translate(${-10*0.8}, ${-10})`} width={barWidth-75*0.8+50} height={barHeight-120*0.8}>
                <BarChart barMode={barMode} height={barinnerHeight+barmargin.gap} width={barinnerWidth+50} data={barData} dataSelected={barDataSelect} 
                margin={barmargin} location={location}maxdate={maxdate}
                />
        </svg></div>

            <div class="tag"> 
            

            <pre style={{fontSize:'16px' }}>
                <b>            SA</b> = stereotype based on appearance
            </pre>
            <pre style={{fontSize:'16px' }}>
            <b>            SCB</b> = stereotype based on cultural background <b>                </b>
            </pre>
            <pre style={{fontSize:'16px' }}>
            <b>            MA</b> = microaggression                G=Groups
            </pre>
            <pre style={{fontSize:'16px' }}>
            <b>            SO</b> = sexual offense                       I=Individuals
            </pre>
            
        </div>

        

            
    <div class="treeMap"> 
            
            <TreeTooltip d={selectedNode} left={tooltipX} top={tooltipY}/>
                <TreeMap
                width={treeWidth} height={treeHeight} root={root} selectedNode={selectedNode} 
                setSelectedNode={setSelectedNode} setTooltipX={setTooltipX} setTooltipY={setTooltipY} />
        </div>

        <div class="timeText"> 
            <pre>2017                             2018                                                                                    2019                                                                                                   2020</pre>
                </div>

        <div class="timeSeries">
        
            <svg width={tsWidth} height={tsHeight}>
            <TimeSeriesChart data={countData} offsetX={tsmargin.right} offsetY={tsmargin.top} 
            width={tsinnerWidth} height={tsinnerHeight} setBrushExtent={setBrushExtent}
            setMinDate={setMinDate} setMaxDate={setMaxDate} mindate={mindate} maxdate={maxdate} unclickTime={unclickTime}/>
            </svg>
            
        </div>

        <div class="table-div">
            <table>
            <thead>
                <tr>
                <th>comment_text</th>
                <th>gender</th>
                <th>location</th>
                <th>likes</th>
                <th>date</th>
                <th>target</th>
                <th>category</th>
                </tr>
            </thead>
            <tbody id="myTable" dangerouslySetInnerHTML={{__html: row}} />
            </table>
        </div>

    </div>
}
ReactDOM.render( <Graph />, document.getElementById('root'));