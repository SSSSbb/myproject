package com.icodeview.rock.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.icodeview.rock.admin.dto.RbacTodoDto;
import com.icodeview.rock.admin.pojo.RbacTodo;
import com.icodeview.rock.admin.vo.RbacTodoVo;
import com.icodeview.rock.vo.PageResult;

public interface RbacTodoService extends IService<RbacTodo> {
    PageResult<RbacTodoVo> getIndex(Integer id,String username,Integer which,Integer belongto,Integer status,String createby,Long pageNum, Long pageSize);
    void createTodo(RbacTodoDto todoDto);
    void deleteTodo(Integer id);
    void updateTodo(RbacTodoDto todoDto);
}
