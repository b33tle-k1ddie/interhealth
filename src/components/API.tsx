import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client';

const client = new ApolloClient({
  link: createHttpLink({
    uri: 'http://10.202.249.200:5000/graphql', // пристрій на якому піднятий аполо
  }),
  cache: new InMemoryCache(),
});

export const GetIp = async ()=>{
  const GET_ALL_USERS = gql`
      query {
        ip
      }
    `;
    try {
      const { data } = await client.query({
        query: GET_ALL_USERS
      });
      console.log(data.ip);
      window.localStorage.setItem('IpRoom', data.ip);
      return data.ip;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
}
export const fetchTablet = async ()=>{
  const key1 = 'Key1';
  const key2 = 'Key2';
  const key = 'key3';
  const tablet = window.localStorage.getItem(key);
  const from_country = window.localStorage.getItem(key1);
  const local_country = window.localStorage.getItem(key2);
  console.log(from_country, local_country, tablet)
  const GET_ALL_USERS = gql`
      query($generic: String, $local: String, $tablet: String) {
        get(generic: $generic, local: $local, tablet: $tablet)
      }
    `;
    try {
      const { data } = await client.query({
        query: GET_ALL_USERS,
        variables: {
          generic: from_country,
          local: local_country,
          tablet: tablet
        },
      });
      
     
      const dat = JSON.parse(data.get)
      console.log(dat[0]);
      const da = JSON.stringify(dat);
      window.localStorage.setItem('res', da);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
 }
 export const GetRoom = async ()=>{
  const GET_ALL_USERS = gql`
      query {
        room{
          net
          country
        }
      }
    `;
    
      const { data } = await client.query({
        query: GET_ALL_USERS
      });
      const dat = data.room[0];
      console.log(dat);
      const dat1 = { key: 'KeyNet', id: dat.net };
      const dat2 = { key: 'KeyCounty', count: dat.country  };
        window.localStorage.setItem(dat1.key, dat1.id);
        window.localStorage.setItem(dat2.key, dat2.count);
      return dat;
   
 }
export const fetchData = async () => {
    const key1 = 'Key1';
    const key2 = 'Key2';
    
    if (window.localStorage.getItem(key1) !== undefined && window.localStorage.getItem(key2) !== undefined) {
      console.log(`${window.localStorage.getItem(key1)}`);
      console.log(`${window.localStorage.getItem(key2)}`);
      const GET_ALL_USERS = gql`
      query($generic: String!, $local: String!) {
        take(generic: $generic, local: $local) {
          key
          generic
          local
        }
      }
    `;
    
    try {
      const { data } = await client.query({
        query: GET_ALL_USERS,
        variables: {
          generic: window.localStorage.getItem(key1),
          local: window.localStorage.getItem(key2),
        },
      });
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    }
  };
  
  export default  {fetchData, GetRoom};
  