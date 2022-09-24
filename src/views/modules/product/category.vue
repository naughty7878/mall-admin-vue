<template>
  <div>
    <el-tree
      :data="dataList"
      show-checkbox
      node-key="catId"
      :props="defaultProps"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
      :default-expanded-keys="expandedKey"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="node.level <= 2"
            type="text"
            size="mini"
            @click="() => append(data)"
          >
            Append
          </el-button>
          <el-button
            v-if="node.childNodes.length == 0"
            type="text"
            size="mini"
            @click="() => remove(node, data)"
          >
            Delete
          </el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <el-form :model="category">
        <el-form-item label="分类名称">
          <el-input v-model="category.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: [],
      expandedKey: [2],
      defaultProps: {
        children: "children",
        label: "name",
      },
      dialogVisible: false,
      category: { name: "", parentCid: 0, catLevel: 0, showStatus: 1, sort: 0 },
    };
  },
  activated() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/mall-product/product/category/list/tree"),
        method: "get",
      }).then(({ data }) => {
        console.log("成功获取分类数据", data);
        this.dataList = data.data;
      });
    },
    append(data) {
      console.log("append", data);
      this.dialogVisible = true;
      this.category.parentCid = data.catId;
      this.category.catLevel = data.catLevel * 1 + 1;
      //  console.log("category", this.category);
    },
    // 添加分类
    addCategory() {
      console.log("category", this.category);
      this.$http({
        url: this.$http.adornUrl("/mall-product/product/category/save"),
        method: "post",
        data: this.$http.adornData(this.category, false),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "新增成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.dialogVisible = false;
              // 刷新节点
              this.getDataList()
              //
              this.expandedKey = [this.category.parentCid];
            },
          });
        } else {
          this.$message.error(data.msg);
        }
      });

    },
    remove(node, data) {
      console.log("node", node, "data", data);
      var ids = [data.catId];
      this.$confirm(`是否删除当前【${data.name}】节点?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/mall-product/product/category/delete"),
            method: "post",
            data: this.$http.adornData(ids, false),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  // 刷新节点
                  this.getDataList();
                  //
                  this.expandedKey = [node.parent.data.catId];
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    handleNodeClick(data) {
      console.log(data);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
