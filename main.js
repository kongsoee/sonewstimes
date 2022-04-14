
let news=[];
let page=1;
let total_pages=0;
let searchbtn=document.getElementById("searchbtn");
let url; //전역번수선언
let menus=document.querySelectorAll(".menus button"); //버튼들 전부 가져오기
//api부르는 함수, await(강제로 기다리게하는 async와 반드시 세트 )
menus.forEach(menu=> 
    menu.addEventListener("click",(event)=>getnewskeyword(event)));


//각 함수에서 필요한 유알엘을 마든가
//에이피아이 호출 함수 부른다

const getnews =async() =>{
    try{
        let header = new Headers({"x-api-key":"PwkxvbUm99Z309ZGQ0rvprgGpQh99xCzX2N0b32xqo8"})
        url.searchParams.set('page', page);  //&page=
        console.log(url);
        
        let response=await fetch(url,{headers:header}); //ajex, http, fetch
    //공식처럼 외워라 ->json은 서버통신에서 많이 쓰는 데이터 타입 객체와 똑같은데 텍스트 타입
    let data =await response.json();
    if(response.status == 200){
        if(data.total_hits == 0){
            throw new Error("검색된 결과값이 없습니다.");
        }
        total_pages =data.total_pages;
        page=data.page;
        news=data.articles;
        console.log(news);
        render(); //->데이터가 있어야 랜더해야하니까 이 안으로 넣음
        pagenation();
    }else{
        throw new Error(data.message);
    }
    
    
    }catch(error){
        console.log("잡힌 에러는",error.message);
        //
        errorRender(error.message);
    };

};

    const getlastesnews =async()=>{
    //URL 자바에서 주는 클래스! new라는 생성자 사용
    url =new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=business&page_size=10`) ;

        getnews();
    
}

//event를 받아온다 어디서? 애드이벤트가 주는 모든 정보!
const getnewskeyword =async(event) =>{
    let topic=event.target.textContent
    url=new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`)
    getnews();
}

//go버튼에 검색어 입력했을 때 데이터 가져오는
const newskeyword = async() =>{
//1.검색 키워드 읽어오기
//2 검색 키워드 붙이기
//3.헤더준비
//4유알엘부르기
//5데이터가져오기
//6데이터 보여주기

//1
let keyword=document.getElementById("search").value

//2
url =new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`)
    getnews();
};

//ui설정
const render =() =>{
    let newsHTML= '';

    newsHTML=news //여기 뉴스는 뉴스어레이
    .map((item)=>{//여기 아이템는 각 뉴스의 아이템

        return`<div class="row news">
        
            <div class="col-lg-4">
            <img class="news-img" src="${item.media}"/>
            </div>
                <div class="col-lg-8">
                <h2>${item.title}</h2>
                <p>${item.summary}</p>
                </div>
                ${item.rights} ${item.published_date}
        </div>`;
    //map끝나고 조인붙이면 string타입변환
    }).join("");
    
    document.getElementById("newsboard").innerHTML=newsHTML;

}

//에러메세지 유아이에 보이게 받아오기
const errorRender = (message) =>{
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">
    ${message}
  </div>`
    document.getElementById("newsboard").innerHTML=errorHTML;
}
//아래 숫자
const pagenation = () => {
    let pagenationHTML ='';
    //토탈페이지수
    //현재 어떤 페이지 보고있는지
    //몇번쨰 그룹에 있는지
    let pagegroup =Math.ceil(page/5);
    //마지막 페이지 먼지
    let last =pagegroup*5;
    //첫 페이지 먼지
    let first =last -4;
    //ㅊㅓ음부터 마지막 페이지 프린트 

    //total page 3까지밖에업다면 세개만 프린트하는법


    if (first>=6){
        pagenationHTML+=`<li class="page-item" onclick="move(1)">
            <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
        </li>
        <li class="page-item" onclick="move(${page - 1})">
            <a class="page-link" href='#js-bottom'>&lt;</a>
        </li>`
    }
    for(let i=first;i<=last;i++){
        pagenationHTML+=` <li class="page-item ${page==i?"active":""}"><a class="page-link" href="#" onclick="move(${i})">${i}</a></li>`
    };

    if(last<total_pages){
        pagenationHTML+= `<li class="page-item">
        <a class="page-link" href="#" aria-label="Next" onclick="move(${page+1})">
          <span aria-hidden="true">&gt;</span>
        </a>
      </li><li class="page-item">
      <a class="page-link" href="#" aria-label="Next" onclick="move(${total_pages})">
        <span aria-hidden="true">&gt;&gt;</span>
      </a>
    </li>`
    }

    //pagenation이라는 클래스 가지고있는 htm태그 선택
    document.querySelector(".pagination").innerHTML=pagenationHTML;
};

//페이지버튼 눌렀을때 움직여라
const move =(pagenum) =>{
    //이동하고싶은 페이지를 알아야함
    page=pagenum
    
    //이동하고싶은 페이지를 가지고 에이피아리르 다시 호출해주자
    getnews();
    //
}
//go버튼 눌렀을때 
searchbtn.addEventListener("click",newskeyword);


getlastesnews();