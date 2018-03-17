
declare module 'react-virtual-list' {
  interface VirtualList {
    (options?: any, mapVirtualToProps?: object): (some: any) => any;
  }

  const VirtualList: VirtualList

  export = VirtualList;
}
